import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'

import type { Options } from 'code-block-writer'
import { Node, Project, SyntaxKind } from 'ts-morph'

import { camelCase, snakeCase } from './change-case.js'
import { getHarnessAgentModuleFileContent } from './content/agent/getHarnessAgentModuleFileContent.js'
import { getHarnessDefinitionTestFileContent } from './content/agent/getHarnessDefinitionTestFileContent.js'
import { getHarnessMountFileContent } from './content/agent/getHarnessMountFileContent.js'
import { getServiceHarnessFileContent } from './content/agent/getServiceHarnessFileContent.js'
import { convertToProjectEventCasing } from './convertToProjectEventCasing.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { PuristaConfig } from './loadPuristaConfig.js'
import type { PuristaProjectInfo } from './scanPuristaProject.js'

const importSpecifier = (fromDirectory: string, targetFile: string) => {
	const path = relative(fromDirectory, targetFile).split(sep).join('/').replace(/\.ts$/, '.js')
	return path.startsWith('.') ? path : `./${path}`
}

const mountHarnessOnService = async (input: {
	serviceFile: string
	mountFile: string
	harnessName: string
	policyName: string
	serviceBuilderName: string
}) => {
	if (!existsSync(input.serviceFile)) throw new Error(`Service file not found: ${input.serviceFile}`)

	const project = new Project({ skipFileDependencyResolution: true, skipLoadingLibFiles: true })
	const sourceFile = project.addSourceFileAtPathIfExists(input.serviceFile)
	if (!sourceFile) throw new Error(`Failed to load service file: ${input.serviceFile}`)

	const moduleSpecifier = importSpecifier(dirname(input.serviceFile), input.mountFile)
	const existingImport = sourceFile.getImportDeclaration(
		declaration => declaration.getModuleSpecifierValue() === moduleSpecifier,
	)
	if (existingImport) {
		const names = new Set(existingImport.getNamedImports().map(namedImport => namedImport.getName()))
		if (!names.has(input.harnessName)) existingImport.addNamedImport(input.harnessName)
		if (!names.has(input.policyName)) existingImport.addNamedImport(input.policyName)
	} else {
		sourceFile.addImportDeclaration({ namedImports: [input.harnessName, input.policyName], moduleSpecifier })
	}

	const serviceExport = sourceFile.getVariableDeclaration(
		declaration =>
			declaration.getName() !== input.serviceBuilderName &&
			(declaration.getInitializer()?.getText().startsWith(input.serviceBuilderName) ?? false),
	)
	if (!serviceExport)
		throw new Error(`Service export based on ${input.serviceBuilderName} not found in ${input.serviceFile}`)

	const initializer = serviceExport.getInitializerOrThrow()
	const mountExpression = `.mountHarness(${input.harnessName}, ${input.policyName})`
	if (!initializer.getText().includes(mountExpression)) {
		serviceExport.setInitializer(`${initializer.getText()}\n\t${mountExpression}`)
	}

	await sourceFile.save()
	const saved = await readFile(input.serviceFile, 'utf8')
	await writeFile(input.serviceFile, saved.replace(/^ +(?=\t)/gm, ''))
}

const addAgentModuleToHarness = async (input: {
	harnessFile: string
	agentFile: string
	agentIdentifier: string
	harnessName: string
}) => {
	const project = new Project({ skipFileDependencyResolution: true, skipLoadingLibFiles: true })
	const sourceFile = project.addSourceFileAtPathIfExists(input.harnessFile)
	if (!sourceFile) throw new Error(`Failed to load Harness file: ${input.harnessFile}`)

	const moduleSpecifier = importSpecifier(dirname(input.harnessFile), input.agentFile)
	if (!sourceFile.getImportDeclaration(declaration => declaration.getModuleSpecifierValue() === moduleSpecifier)) {
		sourceFile.addImportDeclaration({ namedImports: [input.agentIdentifier], moduleSpecifier })
	}

	const declaration = sourceFile.getVariableDeclarationOrThrow(input.harnessName)
	const initializer = declaration.getInitializerOrThrow()
	if (!initializer.getText().includes(`.use(${input.agentIdentifier})`)) {
		const next = initializer.getText().replace(/\.define\(\)\s*$/, `.use(${input.agentIdentifier})\n\t.define()`)
		if (next === initializer.getText()) throw new Error(`Harness ${input.harnessName} has no terminal .define() call.`)
		declaration.setInitializer(next)
	}

	await sourceFile.save()
}

const objectProperty = (object: import('ts-morph').ObjectLiteralExpression, name: string) => {
	const property = object.getPropertyOrThrow(name)
	if (!Node.isPropertyAssignment(property)) throw new Error(`Expected ${name} to be a property assignment.`)
	return property.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)
}

const addAgentToMountPolicy = async (input: {
	mountFile: string
	policyName: string
	agentId: string
	successEventName?: string
}) => {
	const project = new Project({ skipFileDependencyResolution: true, skipLoadingLibFiles: true })
	const sourceFile = project.addSourceFileAtPathIfExists(input.mountFile)
	if (!sourceFile) throw new Error(`Failed to load Harness mount file: ${input.mountFile}`)

	const declaration = sourceFile.getVariableDeclarationOrThrow(input.policyName)
	const policy = declaration.getInitializerOrThrow().getFirstDescendantByKindOrThrow(SyntaxKind.ObjectLiteralExpression)
	const publish = objectProperty(policy, 'publish')
	const agentsProperty = publish.getPropertyOrThrow('agents')
	if (!Node.isPropertyAssignment(agentsProperty))
		throw new Error('Expected publish.agents to be a property assignment.')
	const agents = agentsProperty.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression)
	if (
		!agents.getElements().some(element => element.getText().replaceAll("'", '').replaceAll('"', '') === input.agentId)
	) {
		agents.addElement(`'${input.agentId}'`)
	}

	if (input.successEventName) {
		const targetAgents = objectProperty(objectProperty(policy, 'targets'), 'agents')
		if (!targetAgents.getProperty(input.agentId)) {
			targetAgents.addPropertyAssignment({
				name: input.agentId,
				initializer: `{ successEvent: '${input.successEventName}' }`,
			})
		}
	}

	await sourceFile.save()
}

const ensureHarnessDependency = async (projectPath: string) => {
	const packageFile = join(projectPath, 'package.json')
	const source = await readFile(packageFile, 'utf8')
	const packageJson = JSON.parse(source) as { dependencies?: Record<string, string> }
	packageJson.dependencies ??= {}
	packageJson.dependencies['@purista/harness'] ??= '^3.0.0'
	await writeFile(packageFile, `${JSON.stringify(packageJson, null, '\t')}\n`)
}

/**
 * Add a native Harness agent definition and publish it through an existing
 * PURISTA service. Provider and infrastructure bindings remain in application
 * bootstrap configuration.
 */
export const addPuristaAgent = async (input: {
	projectRootPath?: string
	puristaConfig: PuristaConfig
	puristaProject: PuristaProjectInfo
	serviceName: string
	serviceVersion: string
	agentName: string
	agentDescription: string
	responseEventName?: string
	codeWriterOptions?: Partial<Options>
}) => {
	const projectPath = input.projectRootPath ?? process.cwd()
	const serviceBasePath = input.puristaConfig.servicePath ?? 'src/service'
	const sourceRoot = dirname(serviceBasePath)
	const serviceEntry = input.puristaProject.services[input.serviceName][input.serviceVersion]
	const serviceDirName = convertToProjectFileCasing(input.serviceName, input.puristaConfig)
	const agentDirName = convertToProjectFileCasing(input.agentName, input.puristaConfig)
	const agentIdentifierBase = camelCase(input.agentName)
	const agentIdentifier = agentIdentifierBase.endsWith('Agent') ? agentIdentifierBase : `${agentIdentifierBase}Agent`
	const agentId = snakeCase(input.agentName)
	const serviceBuilderName = camelCase(`${input.serviceName} v${input.serviceVersion} service builder`)
	const harnessName = `${camelCase(input.serviceName)}Harness`
	const policyName = `${camelCase(input.serviceName)}HarnessPolicy`
	const harnessDirectory = join(projectPath, sourceRoot, 'harness', serviceDirName)
	const agentDirectory = join(harnessDirectory, 'agent', agentDirName)
	const agentFile = join(agentDirectory, `${agentDirName}Agent.ts`)
	const definitionFile = join(harnessDirectory, `${serviceDirName}Harness.ts`)
	const mountDirectory = join(projectPath, serviceBasePath, input.serviceName, `v${input.serviceVersion}`, 'harness')
	const mountFile = join(mountDirectory, `${serviceDirName}HarnessMount.ts`)

	if (existsSync(agentDirectory)) {
		throw new Error(`Agent "${input.agentName}" already exists for ${input.serviceName} v${input.serviceVersion}.`)
	}

	await mkdir(agentDirectory, { recursive: true })
	await mkdir(mountDirectory, { recursive: true })

	await writeFile(
		agentFile,
		getHarnessAgentModuleFileContent({
			serviceName: input.serviceName,
			agentName: input.agentName,
			agentDescription: input.agentDescription,
			codeWriterOptions: input.codeWriterOptions,
		}),
	)
	await writeFile(
		join(agentDirectory, `${agentDirName}Agent.test.ts`),
		getHarnessDefinitionTestFileContent({
			agentName: input.agentName,
			harnessName,
			definitionImportName: importSpecifier(agentDirectory, definitionFile),
			codeWriterOptions: input.codeWriterOptions,
		}),
	)
	if (existsSync(definitionFile)) {
		await addAgentModuleToHarness({ harnessFile: definitionFile, agentFile, agentIdentifier, harnessName })
	} else {
		await writeFile(
			definitionFile,
			getServiceHarnessFileContent({
				serviceName: input.serviceName,
				agentIdentifier,
				agentImportName: importSpecifier(harnessDirectory, agentFile),
				codeWriterOptions: input.codeWriterOptions,
			}),
		)
	}

	if (existsSync(mountFile)) {
		await addAgentToMountPolicy({
			mountFile,
			policyName,
			agentId,
			successEventName: input.responseEventName?.trim()
				? convertToProjectEventCasing(input.responseEventName, input.puristaConfig)
				: undefined,
		})
	} else {
		await writeFile(
			mountFile,
			getHarnessMountFileContent({
				serviceName: input.serviceName,
				agentName: input.agentName,
				harnessImportName: importSpecifier(mountDirectory, definitionFile),
				responseEventName: input.responseEventName,
				puristaConfig: input.puristaConfig,
				codeWriterOptions: input.codeWriterOptions,
			}),
		)
	}

	await mountHarnessOnService({
		serviceFile: join(projectPath, serviceBasePath, serviceEntry.serviceFile),
		mountFile,
		harnessName,
		policyName,
		serviceBuilderName,
	})
	await ensureHarnessDependency(projectPath)
}
