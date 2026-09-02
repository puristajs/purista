import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'

import type { Options } from 'code-block-writer'
import { Project } from 'ts-morph'

import { camelCase } from './change-case.js'
import { getHarnessDefinitionFileContent } from './content/agent/getHarnessDefinitionFileContent.js'
import { getHarnessDefinitionTestFileContent } from './content/agent/getHarnessDefinitionTestFileContent.js'
import { getHarnessMountFileContent } from './content/agent/getHarnessMountFileContent.js'
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
	if (!serviceExport) throw new Error(`Service export based on ${input.serviceBuilderName} not found in ${input.serviceFile}`)

	const initializer = serviceExport.getInitializerOrThrow()
	const mountExpression = `.mountHarness(${input.harnessName}, ${input.policyName})`
	if (!initializer.getText().includes(mountExpression)) {
		serviceExport.setInitializer(`${initializer.getText()}\n\t${mountExpression}`)
	}

	await sourceFile.save()
	const saved = await readFile(input.serviceFile, 'utf8')
	await writeFile(input.serviceFile, saved.replace(/^ +(?=\t)/gm, ''))
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
	const agentDirName = convertToProjectFileCasing(input.agentName, input.puristaConfig)
	const serviceBuilderName = camelCase(`${input.serviceName} v${input.serviceVersion} service builder`)
	const harnessName = `${camelCase(input.agentName)}Harness`
	const policyName = `${camelCase(input.agentName)}HarnessPolicy`
	const harnessDirectory = join(projectPath, sourceRoot, 'harness', agentDirName)
	const definitionFile = join(harnessDirectory, `${agentDirName}Harness.ts`)
	const mountDirectory = join(
		projectPath,
		serviceBasePath,
		input.serviceName,
		`v${input.serviceVersion}`,
		'harness',
	)
	const mountFile = join(mountDirectory, `${agentDirName}Mount.ts`)

	if (existsSync(harnessDirectory) || existsSync(mountFile)) {
		throw new Error(`Agent "${input.agentName}" already exists for ${input.serviceName} v${input.serviceVersion}.`)
	}

	await mkdir(harnessDirectory, { recursive: true })
	await mkdir(mountDirectory, { recursive: true })

	await writeFile(
		definitionFile,
		getHarnessDefinitionFileContent({
			agentName: input.agentName,
			agentDescription: input.agentDescription,
			codeWriterOptions: input.codeWriterOptions,
		}),
	)
	await writeFile(
		join(harnessDirectory, `${agentDirName}Harness.test.ts`),
		getHarnessDefinitionTestFileContent({
			agentName: input.agentName,
			definitionImportName: `./${agentDirName}Harness.js`,
			codeWriterOptions: input.codeWriterOptions,
		}),
	)
	await writeFile(
		join(harnessDirectory, 'index.ts'),
		`export { ${harnessName} } from './${agentDirName}Harness.js'\n`,
	)
	await writeFile(
		mountFile,
		getHarnessMountFileContent({
			agentName: input.agentName,
			harnessImportName: importSpecifier(mountDirectory, definitionFile),
			responseEventName: input.responseEventName,
			puristaConfig: input.puristaConfig,
			codeWriterOptions: input.codeWriterOptions,
		}),
	)

	await mountHarnessOnService({
		serviceFile: join(projectPath, serviceBasePath, serviceEntry.serviceFile),
		mountFile,
		harnessName,
		policyName,
		serviceBuilderName,
	})
	await ensureHarnessDependency(projectPath)
}
