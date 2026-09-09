import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { Node, Project, QuoteKind, SyntaxKind } from 'ts-morph'
import { z } from 'zod'
import { generatedDependencyVersion } from '../create/generatedDependencyVersions.js'
import { camelCase } from './change-case.js'
import {
	type AgentHttpProjection,
	getAgentHttpProjectionFileContent,
	getAgentHttpProjectionNames,
	getAgentHttpProjectionTestFileContent,
} from './content/agent/getAgentHttpProjectionFileContent.js'
import { getHarnessAgentFileContent } from './content/agent/getHarnessAgentFileContent.js'
import { getHarnessDefinitionTestFileContent } from './content/agent/getHarnessDefinitionTestFileContent.js'
import {
	getHarnessPaths,
	type HarnessScaffoldingInput,
	importSpecifier,
	prepareHarnessScaffold,
	writeHarnessScaffold,
} from './harnessScaffolding.js'

const packageSchema = z.object({ dependencies: z.record(z.string(), z.string()).optional() }).passthrough()

const readTypeScriptFiles = (directory: string): string[] => {
	if (!existsSync(directory)) return []
	return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
		const path = join(directory, entry.name)
		return entry.isDirectory() ? readTypeScriptFiles(path) : entry.isFile() && entry.name.endsWith('.ts') ? [path] : []
	})
}

const unwrap = (node: Node): Node => {
	if (
		Node.isParenthesizedExpression(node) ||
		Node.isAsExpression(node) ||
		Node.isNonNullExpression(node) ||
		Node.isTypeAssertion(node) ||
		Node.isSatisfiesExpression(node)
	)
		return unwrap(node.getExpression())
	return node
}

const canonicalBuilderRoot = (
	node: Node,
	source: ReturnType<Project['createSourceFile']>,
	expected: string,
	seen = new Set<Node>(),
): boolean => {
	const value = unwrap(node)
	if (seen.has(value)) return false
	seen.add(value)
	if (Node.isCallExpression(value)) return canonicalBuilderRoot(value.getExpression(), source, expected, seen)
	if (Node.isPropertyAccessExpression(value) || Node.isElementAccessExpression(value))
		return canonicalBuilderRoot(value.getExpression(), source, expected, seen)
	if (!Node.isIdentifier(value)) return false
	const declarations = value.getSymbol()?.getDeclarations()
	if (
		declarations?.some(
			declaration =>
				Node.isImportSpecifier(declaration) &&
				declaration.getName() === expected &&
				declaration.getImportDeclaration().getModuleSpecifierValue().startsWith('.'),
		)
	)
		return true
	if (declarations?.length !== 1 || !Node.isVariableDeclaration(declarations[0])) return false
	const initializer = declarations[0].getInitializer()
	return initializer !== undefined && declarations[0].getSourceFile() === source
		? canonicalBuilderRoot(initializer, source, expected, seen)
		: false
}

const staticLiteral = (node: Node | undefined) =>
	node && (Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node))
		? node.getLiteralValue()
		: undefined

const assertProjectionAvailable = (
	serviceDirectory: string,
	serviceBuilderIdentifier: string,
	targetName: string,
	route: string,
	directory: string,
) => {
	if (existsSync(directory))
		throw new Error(`HTTP projection directory already exists: ${directory}. No files were changed.`)
	for (const path of readTypeScriptFiles(serviceDirectory)) {
		const content = readFileSync(path, 'utf8')
		const project = new Project({
			useInMemoryFileSystem: true,
			skipFileDependencyResolution: true,
			skipLoadingLibFiles: true,
		})
		const source = project.createSourceFile(path, content)
		if (source.getPreEmitDiagnostics().some(diagnostic => diagnostic.getCode() >= 1000 && diagnostic.getCode() < 2000))
			throw new Error(`Cannot safely inspect invalid TypeScript in ${path}. No files were changed.`)
		for (const call of source.getDescendantsOfKind(SyntaxKind.CallExpression)) {
			const expression = unwrap(call.getExpression())
			if (
				Node.isElementAccessExpression(expression) &&
				canonicalBuilderRoot(expression, source, serviceBuilderIdentifier)
			)
				throw new Error(`Cannot statically prove a service builder member in ${path}. No files were changed.`)
			if (!Node.isPropertyAccessExpression(expression)) continue
			const member = expression.getName()
			if (
				!['getCommandBuilder', 'getStreamBuilder', 'exposeAsHttpEndpoint', 'exposeAsHttpStreamEndpoint'].includes(
					member,
				)
			)
				continue
			if (!canonicalBuilderRoot(expression.getExpression(), source, serviceBuilderIdentifier)) continue
			if (member === 'getCommandBuilder' || member === 'getStreamBuilder') {
				const id = staticLiteral(call.getArguments()[0])
				if (id === undefined)
					throw new Error(`Cannot statically prove a service target id in ${path}. No files were changed.`)
				if (id === targetName)
					throw new Error(`Target id "${targetName}" already exists in ${path}. No files were changed.`)
			} else {
				const method = staticLiteral(call.getArguments()[0])
				const existingRoute = staticLiteral(call.getArguments()[1])
				if (method === undefined || existingRoute === undefined)
					throw new Error(`Cannot statically prove an HTTP route in ${path}. No files were changed.`)
				if (method === 'POST' && existingRoute === route)
					throw new Error(`HTTP route "POST ${route}" already exists in ${path}. No files were changed.`)
			}
		}
	}
}

const assertMountedTargetAvailable = (harnessFile: string, targetName: string) => {
	if (!existsSync(harnessFile)) return
	const project = new Project({ skipFileDependencyResolution: true, skipLoadingLibFiles: true })
	const source = project.addSourceFileAtPath(harnessFile)
	for (const call of source.getDescendantsOfKind(SyntaxKind.CallExpression)) {
		const expression = unwrap(call.getExpression())
		if (!Node.isPropertyAccessExpression(expression) || !['addAgent', 'addWorkflow'].includes(expression.getName()))
			continue
		const argument = call.getArguments()[0]
		if (!argument || !Node.isIdentifier(argument))
			throw new Error(`Cannot statically prove a mounted Harness target in ${harnessFile}. No files were changed.`)
		const declaration = argument.getSymbol()?.getDeclarations().find(Node.isImportSpecifier)
		if (!declaration)
			throw new Error(`Cannot statically prove a mounted Harness target in ${harnessFile}. No files were changed.`)
		const moduleSpecifier = declaration.getImportDeclaration().getModuleSpecifierValue()
		if (!moduleSpecifier.startsWith('.'))
			throw new Error(`Cannot statically prove a mounted Harness target in ${harnessFile}. No files were changed.`)
		const targetFile = resolve(dirname(harnessFile), moduleSpecifier.replace(/\.js$/, '.ts'))
		if (!existsSync(targetFile))
			throw new Error(`Cannot statically prove a mounted Harness target in ${harnessFile}. No files were changed.`)
		const targetSource = project.addSourceFileAtPath(targetFile)
		const targetDeclaration = targetSource.getVariableDeclaration(argument.getText())
		const targetInitializer = targetDeclaration?.getInitializer()
		if (!targetInitializer || !Node.isCallExpression(targetInitializer))
			throw new Error(`Cannot statically prove a mounted Harness target in ${targetFile}. No files were changed.`)
		const factory = unwrap(targetInitializer.getExpression())
		if (!Node.isIdentifier(factory) || !['defineAgent', 'defineWorkflow'].includes(factory.getText()))
			throw new Error(`Cannot statically prove a mounted Harness target in ${targetFile}. No files were changed.`)
		const id = staticLiteral(targetInitializer.getArguments()[0])
		if (id === undefined)
			throw new Error(`Cannot statically prove a mounted Harness target id in ${targetFile}. No files were changed.`)
		if (id === targetName)
			throw new Error(
				`Mounted Harness target id "${targetName}" already exists in ${targetFile}. No files were changed.`,
			)
	}
}

const addProjectionToService = (
	servicePath: string,
	content: string,
	input: { kind: 'command' | 'stream'; builderIdentifier: string; builderFile: string },
) => {
	const project = new Project({
		useInMemoryFileSystem: true,
		skipFileDependencyResolution: true,
		skipLoadingLibFiles: true,
		manipulationSettings: { quoteKind: QuoteKind.Single },
	})
	const source = project.createSourceFile(servicePath, content)
	const arrayName = input.kind === 'command' ? 'commandDefinitions' : 'streamDefinitions'
	const array = source.getVariableDeclaration(arrayName)?.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression)
	if (!array)
		throw new Error(
			`Variable "${arrayName}" is not a canonical array literal in ${servicePath}. No files were changed.`,
		)
	if (
		source
			.getImportDeclarations()
			.some(declaration =>
				declaration
					.getNamedImports()
					.some(named => (named.getAliasNode()?.getText() ?? named.getName()) === input.builderIdentifier),
			)
	)
		throw new Error(
			`Cannot import ${input.builderIdentifier} in ${servicePath}: that identifier already exists. No files were changed.`,
		)
	source.addImportDeclaration({
		namedImports: [input.builderIdentifier],
		moduleSpecifier: importSpecifier(dirname(servicePath), input.builderFile),
	})
	array.addElement(`${input.builderIdentifier}.getDefinition()`)
	return source.getFullText().replace(/^ +(?=\t)/gm, '')
}

const bootstrapEntrypoint = (entrypoint: string, input: { serviceName: string; serviceVersion: string }) => {
	if (!existsSync(entrypoint))
		throw new Error(`Application entrypoint not found: ${entrypoint}. No files were changed.`)
	const project = new Project({
		useInMemoryFileSystem: true,
		skipFileDependencyResolution: true,
		skipLoadingLibFiles: true,
		manipulationSettings: { quoteKind: QuoteKind.Single },
	})
	const source = project.createSourceFile(entrypoint, readFileSync(entrypoint, 'utf8'))
	if (source.getPreEmitDiagnostics().some(diagnostic => diagnostic.getCode() >= 1000 && diagnostic.getCode() < 2000))
		throw new Error(`Cannot safely edit invalid TypeScript in ${entrypoint}. No files were changed.`)
	for (const name of ['openai', 'env']) {
		if (
			source.getDescendantsOfKind(SyntaxKind.Identifier).some(
				identifier =>
					identifier.getText() === name &&
					identifier
						.getSymbol()
						?.getDeclarations()
						.some(
							declaration => declaration.getSourceFile() === source && declaration.getStart() !== identifier.getStart(),
						),
			)
		)
			throw new Error(
				`Cannot safely add runtime binding ${name} in ${entrypoint}: the identifier already exists. No files were changed.`,
			)
	}
	const serviceIdentifier = camelCase(`${input.serviceName} v${input.serviceVersion} service`)
	const calls = source.getDescendantsOfKind(SyntaxKind.CallExpression).filter(call => {
		const expression = call.getExpression()
		return (
			Node.isPropertyAccessExpression(expression) &&
			expression.getName() === 'getInstance' &&
			expression.getExpression().getText() === serviceIdentifier
		)
	})
	if (calls.length !== 1 || calls[0].getArguments().length !== 1)
		throw new Error(`Cannot safely add the canonical ai.model bootstrap to ${entrypoint}. No files were changed.`)
	source.addImportDeclaration({ namedImports: ['openai'], moduleSpecifier: '@purista/harness-openai' })
	source.addImportDeclaration({ namedImports: ['env'], moduleSpecifier: './config/env.js' })
	calls[0].addArgument(`{
		ai: {
			model: {
				provider: openai({ apiKey: env.OPENAI_API_KEY }),
				model: 'gpt-5-mini',
			},
		},
	}`)
	return source.getFullText().replace(/^ +(?=\t)/gm, '')
}

const envFileContent = `import { z } from 'zod'

const envSchema = z.object({
\tOPENAI_API_KEY: z.string().min(1),
})

export const env = envSchema.parse(process.env)
`

/** Generate a colocated string agent, optional protected HTTP projection, and first-agent runtime bootstrap. */
export const addPuristaAgent = async (
	input: HarnessScaffoldingInput & {
		agentName: string
		agentDescription: string
		http?: AgentHttpProjection
	},
) => {
	const http = input.http ?? 'none'
	const paths = getHarnessPaths(input)
	const files = prepareHarnessScaffold(input, {
		kind: 'Agent',
		name: input.agentName,
		content: getHarnessAgentFileContent(input),
		testContent: importName =>
			getHarnessDefinitionTestFileContent({
				agentName: input.agentName,
				agentImportName: importName,
				codeWriterOptions: input.codeWriterOptions,
			}),
	})
	const packageFile = join(paths.projectPath, 'package.json')
	const packagePlan = files.find(file => file.path === packageFile)
	const servicePlan = files.find(file => file.path === paths.serviceFile)
	if (!packagePlan || !servicePlan)
		throw new Error('Internal error: incomplete Harness scaffold plan. No files were changed.')
	const packageJson = packageSchema.parse(JSON.parse(packagePlan.content))
	packageJson.dependencies = { ...packageJson.dependencies }
	const firstAgent = !existsSync(join(paths.harnessDirectory, 'agent'))
	const warnings: string[] = []

	if (http !== 'none') {
		const names = getAgentHttpProjectionNames({ agentName: input.agentName, http, puristaConfig: input.puristaConfig })
		const projectionDirectory = join(dirname(paths.serviceFile), names.kind, names.directoryName)
		const projectionFile = join(projectionDirectory, `${names.builderFileName}.ts`)
		assertProjectionAvailable(
			dirname(paths.serviceFile),
			paths.serviceBuilderIdentifier,
			names.targetName,
			names.route,
			projectionDirectory,
		)
		assertMountedTargetAvailable(paths.harnessFile, names.targetName)
		const agentFile = files.find(
			file => file.path.includes(`${sep}harness${sep}agent${sep}`) && !file.path.endsWith('.test.ts'),
		)?.path
		if (!agentFile) throw new Error('Internal error: generated agent definition is missing. No files were changed.')
		files.unshift(
			{
				path: projectionFile,
				content: getAgentHttpProjectionFileContent({
					...input,
					http,
					agentImport: importSpecifier(projectionDirectory, agentFile),
				}),
			},
			{
				path: projectionFile.replace(/\.ts$/, '.test.ts'),
				content: getAgentHttpProjectionTestFileContent({
					serviceName: input.serviceName,
					serviceVersion: input.serviceVersion,
					agentName: input.agentName,
					http,
					puristaConfig: input.puristaConfig,
					agentImport: importSpecifier(projectionDirectory, agentFile),
					codeWriterOptions: input.codeWriterOptions,
				}),
			},
		)
		servicePlan.content = addProjectionToService(paths.serviceFile, servicePlan.content, {
			kind: names.kind,
			builderIdentifier: names.builderIdentifier,
			builderFile: projectionFile,
		})
		if (http === 'stream') {
			packageJson.dependencies['@purista/harness-ai-sdk-ui'] = generatedDependencyVersion('@purista/harness-ai-sdk-ui')
			packageJson.dependencies.ai = generatedDependencyVersion('ai')
		}
	}

	const entrypoint = join(paths.projectPath, 'src', 'index.ts')
	if (firstAgent && existsSync(entrypoint)) {
		const envFile = join(paths.projectPath, 'src', 'config', 'env.ts')
		if (existsSync(envFile)) throw new Error(`Environment schema already exists: ${envFile}. No files were changed.`)
		const envExample = join(paths.projectPath, '.env.example')
		const currentEnvExample = existsSync(envExample) ? readFileSync(envExample, 'utf8') : ''
		if (/^OPENAI_API_KEY=/m.test(currentEnvExample))
			throw new Error(`OPENAI_API_KEY already exists in ${envExample}. No files were changed.`)
		files.push(
			{ path: envFile, content: envFileContent },
			{
				path: envExample,
				content: `${currentEnvExample}${currentEnvExample && !currentEnvExample.endsWith('\n') ? '\n' : ''}OPENAI_API_KEY=\n`,
			},
			{ path: entrypoint, content: bootstrapEntrypoint(entrypoint, input) },
		)
		packageJson.dependencies['@purista/harness-openai'] = generatedDependencyVersion('@purista/harness-openai')
	} else if (firstAgent) {
		warnings.push(
			'No standard src/index.ts entrypoint was found. Configure the mounted service with ai.model and a model provider before startup.',
		)
	}
	packagePlan.content = `${JSON.stringify(packageJson, null, '\t')}\n`

	for (const file of files) {
		if (relative(resolve(paths.projectPath), resolve(file.path)).startsWith('..'))
			throw new Error(`Generated path is outside the project: ${file.path}. No files were changed.`)
		if (files.filter(candidate => resolve(candidate.path) === resolve(file.path)).length !== 1)
			throw new Error(`Generated path collides inside the mutation plan: ${file.path}. No files were changed.`)
	}
	return { ...(await writeHarnessScaffold(files)), warnings }
}
