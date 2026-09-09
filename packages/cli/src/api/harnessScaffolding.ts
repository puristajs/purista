import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve, sep } from 'node:path'
import type { Options } from 'code-block-writer'
import { type Expression, Node, Project, type SourceFile, SyntaxKind, VariableDeclarationKind } from 'ts-morph'
import { z } from 'zod'
import type { PuristaCommandResult } from '../core/types.js'
import { camelCase } from './change-case.js'
import { getServiceHarnessFileContent } from './content/harness/getServiceHarnessFileContent.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { PuristaConfig } from './loadPuristaConfig.js'
import type { PuristaProjectInfo } from './scanPuristaProject.js'

/** Published dependency used by every service-owned Harness generator. */
export const harnessPackageVersion = '^4.0.0'

/** Shared project and service selection for the Harness generators. */
export type HarnessScaffoldingInput = {
	projectRootPath?: string
	puristaConfig: PuristaConfig
	puristaProject: PuristaProjectInfo
	serviceName: string
	serviceVersion: string
	codeWriterOptions?: Partial<Options>
}

/** Compute an ESM import between generated source files. */
export const importSpecifier = (fromDirectory: string, targetFile: string) => {
	const path = relative(fromDirectory, targetFile).split(sep).join('/').replace(/\.ts$/, '.js')
	return path.startsWith('.') ? path : `./${path}`
}

/** Resolve the existing service's actual directory, independent of configured file casing. */
export const getHarnessPaths = (input: HarnessScaffoldingInput) => {
	const projectPath = input.projectRootPath ?? process.cwd()
	const serviceDirectory = convertToProjectFileCasing(input.serviceName, input.puristaConfig)
	const entry = (input.puristaProject.services[input.serviceName] ?? input.puristaProject.services[serviceDirectory])?.[
		input.serviceVersion
	]
	if (!entry) throw new Error(`Service ${input.serviceName} v${input.serviceVersion} was not found.`)
	const serviceFile = join(projectPath, input.puristaConfig.servicePath, entry.serviceFile)
	const harnessDirectory = join(dirname(serviceFile), 'harness')
	return {
		projectPath,
		serviceFile,
		harnessDirectory,
		harnessFile: join(
			harnessDirectory,
			`${convertToProjectFileCasing(`${input.serviceName} harness`, input.puristaConfig)}.ts`,
		),
		harnessIdentifier: `${camelCase(input.serviceName)}Harness`,
		serviceBuilderIdentifier: camelCase(`${input.serviceName} v${input.serviceVersion} service builder`),
	}
}

const loadSource = (path: string) => {
	const project = new Project({
		useInMemoryFileSystem: true,
		skipFileDependencyResolution: true,
		skipLoadingLibFiles: true,
	})
	const source = project.createSourceFile(path, readFileSync(path, 'utf8'))
	if (source.getPreEmitDiagnostics().some(diagnostic => diagnostic.getCode() >= 1000 && diagnostic.getCode() < 2000)) {
		throw new Error(`Cannot safely edit invalid TypeScript in ${path}.`)
	}
	return source
}

const chain = (expression: Expression) => {
	const calls: { name: string; args: Node[] }[] = []
	let base = expression
	while (Node.isCallExpression(base) && Node.isPropertyAccessExpression(base.getExpression())) {
		const property = base.getExpression()
		if (!Node.isPropertyAccessExpression(property)) break
		calls.unshift({ name: property.getName(), args: base.getArguments() })
		base = property.getExpression()
	}
	return { base, calls }
}

const isImported = (source: SourceFile, name: string, moduleSpecifier: string) =>
	source
		.getImportDeclarations()
		.some(
			declaration =>
				declaration.getModuleSpecifierValue() === moduleSpecifier &&
				!declaration.isTypeOnly() &&
				declaration
					.getNamedImports()
					.some(named => named.getName() === name && !named.getAliasNode() && !named.isTypeOnly()),
		)

const bindsName = (node: Node, name: string): boolean => {
	if (Node.isIdentifier(node)) return node.getText() === name
	if (Node.isObjectBindingPattern(node) || Node.isArrayBindingPattern(node)) {
		return node.getElements().some(element => Node.isBindingElement(element) && bindsName(element.getNameNode(), name))
	}
	return false
}

const hasLocalValueDeclaration = (source: SourceFile, name: string) =>
	source.getStatements().some(statement => {
		if (Node.isVariableStatement(statement))
			return statement.getDeclarations().some(declaration => bindsName(declaration.getNameNode(), name))
		if (
			Node.isFunctionDeclaration(statement) ||
			Node.isClassDeclaration(statement) ||
			Node.isEnumDeclaration(statement) ||
			Node.isImportEqualsDeclaration(statement)
		)
			return statement.getName() === name
		if (Node.isModuleDeclaration(statement)) return bindsName(statement.getNameNode(), name)
		// Interfaces and type aliases occupy only the type namespace; generated definitions are value-only exports.
		return false
	})

const addImport = (source: SourceFile, name: string, moduleSpecifier: string) => {
	const alreadyImported = isImported(source, name, moduleSpecifier)
	const localImportBindings = source
		.getImportDeclarations()
		.flatMap(declaration => [
			declaration.getDefaultImport()?.getText(),
			declaration.getNamespaceImport()?.getText(),
			...declaration.getNamedImports().map(named => named.getAliasNode()?.getText() ?? named.getName()),
		])
		.filter(binding => binding === name)
	// The existing matching named import may be reused only when it is the sole local binding.
	if (hasLocalValueDeclaration(source, name) || localImportBindings.length > (alreadyImported ? 1 : 0)) {
		throw new Error(`Cannot import ${name} in ${source.getFilePath()}: that identifier already exists.`)
	}
	if (!alreadyImported) source.addImportDeclaration({ namedImports: [name], moduleSpecifier })
}

const serviceCalls = new Set([
	'addCommandDefinition',
	'addSubscriptionDefinition',
	'addStreamDefinition',
	'addQueueDefinition',
	'addQueueWorkerDefinition',
])

const composeService = (paths: ReturnType<typeof getHarnessPaths>) => {
	const { serviceFile, harnessFile, harnessIdentifier, serviceBuilderIdentifier } = paths
	const source = loadSource(serviceFile)
	const moduleSpecifier = importSpecifier(dirname(serviceFile), harnessFile)
	const guidance = `Cannot safely compose ${serviceFile}. Import { ${harnessIdentifier} } from '${moduleSpecifier}' and add .mountHarness(${harnessIdentifier}) to the final ${serviceBuilderIdentifier} chain manually; no files were changed.`
	const candidates = source
		.getVariableDeclarations()
		.filter(declaration => declaration.isExported() && declaration.getName() !== serviceBuilderIdentifier)
	const declaration = candidates.find(candidate => {
		const initializer = candidate.getInitializer()
		return initializer && chain(initializer).base.getText() === serviceBuilderIdentifier
	})
	if (
		!declaration ||
		candidates.filter(
			candidate =>
				candidate.getInitializer() &&
				chain(candidate.getInitializerOrThrow()).base.getText() === serviceBuilderIdentifier,
		).length !== 1
	)
		throw new Error(guidance)
	const initializer = declaration.getInitializerOrThrow()
	const { calls } = chain(initializer)
	if (calls.some(call => !serviceCalls.has(call.name) && call.name !== 'mountHarness')) throw new Error(guidance)
	const mounts = calls.filter(call => call.name === 'mountHarness')
	for (const call of calls) {
		if (call.name === 'mountHarness') continue
		const expectedArgument = `${call.name.slice(3, -'Definition'.length)}Definitions`
		const argument = call.args[0]
		if (
			call.args.length !== 1 ||
			!Node.isSpreadElement(argument) ||
			argument.getExpression().getText() !== camelCase(expectedArgument)
		)
			throw new Error(guidance)
	}
	if (
		mounts.length > 1 ||
		mounts.some(mount => mount.args.length !== 1 || mount.args[0].getText() !== harnessIdentifier)
	)
		throw new Error(guidance)
	if (mounts.length && !isImported(source, harnessIdentifier, moduleSpecifier)) throw new Error(guidance)
	if (!mounts.length) {
		addImport(source, harnessIdentifier, moduleSpecifier)
		declaration.setInitializer(`${initializer.getText()}\n\t.mountHarness(${harnessIdentifier})`)
	}
	return source.getFullText().replace(/^ +(?=\t)/gm, '')
}

const staticString = (node: Node | undefined, source: SourceFile, visited = new Set<Node>()): string | undefined => {
	if (!node || visited.has(node)) return undefined
	visited.add(node)
	if (Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node)) return node.getLiteralValue()
	if (Node.isParenthesizedExpression(node) || Node.isAsExpression(node))
		return staticString(node.getExpression(), source, visited)
	if (!Node.isIdentifier(node)) return undefined
	const declarations = node.getSymbol()?.getDeclarations()
	if (declarations?.length !== 1) return undefined
	const declaration = declarations[0]
	if (!Node.isVariableDeclaration(declaration) || declaration.getSourceFile() !== source) return undefined
	const list = declaration.getParent()
	if (!Node.isVariableDeclarationList(list) || list.getDeclarationKind() !== VariableDeclarationKind.Const)
		return undefined
	return staticString(declaration.getInitializer(), source, visited)
}

const targetFactories = new Set(['defineAgent', 'defineWorkflow', 'getCommandBuilder', 'getStreamBuilder'])

const unwrapExpression = (node: Node): Node => {
	if (
		Node.isParenthesizedExpression(node) ||
		Node.isAsExpression(node) ||
		Node.isNonNullExpression(node) ||
		Node.isTypeAssertion(node) ||
		Node.isSatisfiesExpression(node)
	)
		return unwrapExpression(node.getExpression())
	return node
}

const sameFileConstInitializer = (node: Node, source: SourceFile): Node | undefined => {
	if (!Node.isIdentifier(node)) return undefined
	const declarations = node.getSymbol()?.getDeclarations()
	if (declarations?.length !== 1) return undefined
	const declaration = declarations[0]
	if (!Node.isVariableDeclaration(declaration) || declaration.getSourceFile() !== source) return undefined
	const list = declaration.getParent()
	return Node.isVariableDeclarationList(list) && list.getDeclarationKind() === VariableDeclarationKind.Const
		? declaration.getInitializer()
		: undefined
}

const isServiceBuilderReference = (expression: Node, source: SourceFile, visited = new Set<Node>()): boolean => {
	const node = unwrapExpression(expression)
	if (visited.has(node)) return false
	visited.add(node)
	if (Node.isIdentifier(node)) {
		if (node.getText().endsWith('ServiceBuilder')) return true
		if (
			node
				.getSymbol()
				?.getDeclarations()
				.some(declaration => Node.isImportSpecifier(declaration) && declaration.getName().endsWith('ServiceBuilder'))
		)
			return true
	}
	const initializer = sameFileConstInitializer(node, source)
	return initializer ? isServiceBuilderReference(initializer, source, visited) : false
}

const factoryName = (expression: Node, source: SourceFile, visited = new Set<Node>()): string | undefined => {
	const node = unwrapExpression(expression)
	if (visited.has(node)) return undefined
	visited.add(node)
	if (Node.isPropertyAccessExpression(node)) return node.getName()
	if (Node.isElementAccessExpression(node)) {
		const name = staticString(node.getArgumentExpression(), source)
		if (name === undefined && isServiceBuilderReference(node.getExpression(), source)) {
			throw new Error(
				`Cannot statically prove the target factory member in ${source.getFilePath()}. Use a literal factory name or compose the Harness manually; no files were changed.`,
			)
		}
		return name
	}
	if (Node.isIdentifier(node)) {
		if (targetFactories.has(node.getText())) return node.getText()
		const imported = node
			.getSymbol()
			?.getDeclarations()
			.find(declaration => Node.isImportSpecifier(declaration))
		if (imported && Node.isImportSpecifier(imported) && targetFactories.has(imported.getName()))
			return imported.getName()
		const initializer = sameFileConstInitializer(node, source)
		return initializer ? factoryName(initializer, source, visited) : undefined
	}
	return undefined
}

const isUninvokedFactoryReference = (node: Node, source: SourceFile) => {
	if (!Node.isIdentifier(node) && !Node.isPropertyAccessExpression(node) && !Node.isElementAccessExpression(node))
		return false
	const parent = node.getParent()
	if (Node.isPropertyAccessExpression(parent) && parent.getNameNode() === node) return false
	const name = factoryName(node, source)
	if (!name || !targetFactories.has(name)) return false
	let expression: Node = node
	while (expression.getParent() && unwrapExpression(expression.getParentOrThrow()) === node)
		expression = expression.getParentOrThrow()
	const call = expression.getParent()
	return !Node.isCallExpression(call) || call.getExpression() !== expression
}

const hasDetachedFactoryReference = (node: Node, source: SourceFile): boolean => {
	if (Node.isPropertyAccessExpression(node) || Node.isElementAccessExpression(node))
		return isUninvokedFactoryReference(node, source)
	let key: Node | undefined
	let receiver: Node | undefined
	if (Node.isBindingElement(node) && Node.isObjectBindingPattern(node.getParent())) {
		key = node.getPropertyNameNode() ?? node.getNameNode()
		const declaration = node.getFirstAncestorByKind(SyntaxKind.VariableDeclaration)
		receiver = declaration?.getInitializer()
	} else if (
		Node.isPropertyAssignment(node) ||
		Node.isShorthandPropertyAssignment(node) ||
		Node.isSpreadAssignment(node)
	) {
		const object = node.getParent()
		const assignment = object?.getParent()
		if (
			!Node.isObjectLiteralExpression(object) ||
			!Node.isBinaryExpression(assignment) ||
			assignment.getLeft() !== object ||
			assignment.getOperatorToken().getKind() !== SyntaxKind.EqualsToken
		)
			return false
		key = Node.isSpreadAssignment(node) ? undefined : node.getNameNode()
		receiver = assignment.getRight()
	} else return false
	const name = Node.isIdentifier(key)
		? key.getText()
		: staticString(Node.isComputedPropertyName(key) ? key.getExpression() : key, source)
	return (
		(name !== undefined && targetFactories.has(name)) ||
		(receiver !== undefined &&
			isServiceBuilderReference(receiver, source) &&
			(name === undefined || (Node.isBindingElement(node) && node.getDotDotDotToken() !== undefined)))
	)
}

const assertNoDuplicateId = (directory: string, id: string) => {
	if (!existsSync(directory)) return
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name)
		if (entry.isDirectory()) assertNoDuplicateId(path, id)
		if (!entry.isFile() || !entry.name.endsWith('.ts') || entry.name.endsWith('.test.ts')) continue
		const source = loadSource(path)
		// Detached methods cannot establish target addresses without following arbitrary alias dataflow.
		if (source.getDescendants().some(node => hasDetachedFactoryReference(node, source)))
			throw new Error(
				`Cannot statically prove the target factory invocation in ${path}. Call the factory directly or compose the Harness manually; no files were changed.`,
			)
		for (const call of source.getDescendantsOfKind(SyntaxKind.CallExpression)) {
			const expression = call.getExpression()
			const factory = factoryName(expression, source)
			if (!factory || !targetFactories.has(factory)) {
				if (expression.getDescendants().some(node => isUninvokedFactoryReference(node, source)))
					throw new Error(
						`Cannot statically prove the target factory invocation in ${path}. Call the factory directly or compose the Harness manually; no files were changed.`,
					)
				continue
			}
			const name = staticString(call.getArguments()[0], source)
			if (name === undefined)
				throw new Error(
					`Cannot statically prove the ${factory} target id in ${path}. Use a string literal or a same-file const string alias, or compose the Harness manually; no files were changed.`,
				)
			if (name === id) throw new Error(`Target id "${id}" already exists in ${path}. No files were changed.`)
		}
	}
}

/** Prepare the entire Harness graph and package edit before creating any directory or file. */
export const prepareHarnessScaffold = (
	input: HarnessScaffoldingInput,
	root?: {
		kind: 'Agent' | 'Workflow'
		name: string
		content: string
		testContent: (importName: string) => string
	},
	harnessName?: string,
) => {
	const paths = getHarnessPaths(input)
	const definitionName = harnessName ?? camelCase(input.serviceName)
	if (!/^[a-z][a-zA-Z0-9]{0,63}$/.test(definitionName))
		throw new Error(
			`Harness name "${definitionName}" must be lower camel case with at most 64 ASCII letters or digits.`,
		)
	const { harnessFile, harnessDirectory, harnessIdentifier } = paths
	if (harnessIdentifier === 'defineHarness')
		throw new Error(
			`Service name "${input.serviceName}" produces ${harnessIdentifier}, which collides with the imported Harness factory. Choose a different service name; no files were changed.`,
		)
	const files: { path: string; content: string }[] = []
	const exists = existsSync(harnessFile)
	if (!root && exists) throw new Error(`Harness already exists: ${harnessFile}`)
	// Parse and validate package metadata before any graph mutation.
	const packageFile = join(paths.projectPath, 'package.json')
	const packageSchema = z.object({ dependencies: z.record(z.string(), z.string()).optional() }).passthrough()
	const packageJson = packageSchema.parse(JSON.parse(readFileSync(packageFile, 'utf8')))
	packageJson.dependencies = { ...packageJson.dependencies, '@purista/harness': harnessPackageVersion }
	const serviceContent = composeService(paths)
	let rootIdentifier: string | undefined
	let rootFile: string | undefined
	if (root) {
		const id = camelCase(root.name)
		if (!/^[a-z][a-zA-Z0-9]{0,63}$/.test(id))
			throw new Error(`The name "${root.name}" must produce a lower-camel identifier beginning with a letter.`)
		rootIdentifier = id.endsWith(root.kind) ? id : `${id}${root.kind}`
		if (rootIdentifier === `define${root.kind}`)
			throw new Error(
				`${root.kind} name "${root.name}" produces ${rootIdentifier}, which collides with the imported definition factory. Choose a different name; no files were changed.`,
			)
		const directory = join(
			harnessDirectory,
			root.kind.toLowerCase(),
			convertToProjectFileCasing(root.name, input.puristaConfig),
		)
		rootFile = join(directory, `${convertToProjectFileCasing(rootIdentifier, input.puristaConfig)}.ts`)
		if (existsSync(directory)) throw new Error(`${root.kind} directory already exists: ${directory}`)
		assertNoDuplicateId(dirname(paths.serviceFile), id)
		files.push(
			{ path: rootFile, content: root.content },
			{ path: rootFile.replace(/\.ts$/, '.test.ts'), content: root.testContent(importSpecifier(directory, rootFile)) },
		)
	}
	let harnessContent: string
	if (exists) {
		const source = loadSource(harnessFile)
		const declaration = source.getVariableDeclaration(harnessIdentifier)
		const initializer = declaration?.getInitializer()
		const guidance = `Cannot safely compose ${harnessFile}. Import { ${rootIdentifier} } from '${importSpecifier(harnessDirectory, rootFile ?? harnessFile)}' and add .add${root?.kind}(${rootIdentifier}) to ${harnessIdentifier} manually; no files were changed.`
		if (!declaration?.isExported() || !initializer) throw new Error(guidance)
		const { base, calls } = chain(initializer)
		if (
			!Node.isCallExpression(base) ||
			base.getExpression().getText() !== 'defineHarness' ||
			base.getArguments().length !== 1 ||
			!Node.isObjectLiteralExpression(base.getArguments()[0]) ||
			!isImported(source, 'defineHarness', '@purista/harness') ||
			calls.some(
				call =>
					!['addAgent', 'addWorkflow'].includes(call.name) ||
					call.args.length !== 1 ||
					!Node.isIdentifier(call.args[0]),
			)
		)
			throw new Error(guidance)
		for (const call of calls) {
			const identifier = call.args[0].getText()
			const imported = source
				.getImportDeclarations()
				.find(
					declaration =>
						!declaration.isTypeOnly() &&
						declaration
							.getNamedImports()
							.some(named => named.getName() === identifier && !named.getAliasNode() && !named.isTypeOnly()),
				)
			if (!imported?.getModuleSpecifierValue().startsWith('.')) throw new Error(guidance)
			const definitionFile = resolve(harnessDirectory, imported.getModuleSpecifierValue().replace(/\.js$/, '.ts'))
			if (!existsSync(definitionFile)) throw new Error(guidance)
			const definition = loadSource(definitionFile).getVariableDeclaration(identifier)
			const expression = definition?.getInitializer()
			if (
				!definition?.isExported() ||
				!expression ||
				!Node.isCallExpression(expression) ||
				expression.getExpression().getText() !== (call.name === 'addAgent' ? 'defineAgent' : 'defineWorkflow')
			)
				throw new Error(guidance)
			const id = expression.getArguments()[0]
			if (!id || !Node.isStringLiteral(id)) throw new Error(guidance)
			if (root && id.getLiteralValue() === camelCase(root.name))
				throw new Error(
					`Target id "${id.getLiteralValue()}" already exists in ${definitionFile}. No files were changed.`,
				)
		}
		if (root && rootIdentifier && rootFile) {
			if (calls.some(call => call.args[0].getText() === rootIdentifier))
				throw new Error(`Root ${rootIdentifier} already exists in ${harnessFile}.`)
			addImport(source, rootIdentifier, importSpecifier(harnessDirectory, rootFile))
			declaration.setInitializer(`${initializer.getText()}\n\t.add${root.kind}(${rootIdentifier})`)
		}
		harnessContent = source.getFullText().replace(/^ +(?=\t)/gm, '')
	} else {
		harnessContent = getServiceHarnessFileContent({
			serviceName: input.serviceName,
			harnessName,
			rootIdentifier,
			rootImportName: rootFile ? importSpecifier(harnessDirectory, rootFile) : undefined,
			rootKind: root?.kind,
			codeWriterOptions: input.codeWriterOptions,
		})
	}
	files.push(
		{ path: harnessFile, content: harnessContent },
		{ path: paths.serviceFile, content: serviceContent },
		{ path: packageFile, content: `${JSON.stringify(packageJson, null, '\t')}\n` },
	)
	// Ensure every target belongs to this project, including custom servicePath.
	for (const file of files)
		if (relative(resolve(paths.projectPath), resolve(file.path)).startsWith('..'))
			throw new Error(`Generated path is outside the project: ${file.path}`)
	return files
}

/** Persist an already validated generation plan; no project analysis happens during mutation. */
export const writeHarnessScaffold = async (
	files: ReturnType<typeof prepareHarnessScaffold>,
): Promise<Pick<PuristaCommandResult, 'createdFiles' | 'updatedFiles'>> => {
	const createdFiles = files.filter(file => !existsSync(file.path)).map(file => file.path)
	const updatedFiles = files.filter(file => existsSync(file.path)).map(file => file.path)
	for (const file of files) {
		await mkdir(dirname(file.path), { recursive: true })
		await writeFile(file.path, file.content)
	}
	return { createdFiles, updatedFiles }
}
