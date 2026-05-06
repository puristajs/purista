import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { Options } from 'code-block-writer'
import { Project, SyntaxKind, VariableDeclarationKind } from 'ts-morph'

import { camelCase } from './change-case.js'
import { getAgentBuilderFileContent } from './content/agent/getAgentBuilderFileContent.js'
import { getAgentTestFileContent } from './content/agent/getAgentTestFileContent.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { PuristaConfig } from './loadPuristaConfig.js'
import type { PuristaProjectInfo } from './scanPuristaProject.js'

const addAgentDefinitionToService = async (input: {
	serviceFile: string
	importFile: string
	importDefinition: string
	serviceBuilderName: string
}) => {
	if (!existsSync(input.serviceFile)) {
		throw new Error(`Service file not found: ${input.serviceFile}`)
	}

	const project = new Project({ skipFileDependencyResolution: true, skipLoadingLibFiles: true })
	const sourceFile = project.addSourceFileAtPathIfExists(input.serviceFile)
	if (!sourceFile) {
		throw new Error(`Failed to load service file: ${input.serviceFile}`)
	}

	const moduleSpecifier = input.importFile.replace(/\.ts$/, '.js')
	const existingImport = sourceFile.getImportDeclaration(
		declaration => declaration.getModuleSpecifierValue() === moduleSpecifier,
	)
	if (existingImport) {
		const hasNamedImport = existingImport
			.getNamedImports()
			.some(namedImport => namedImport.getName() === input.importDefinition)
		if (!hasNamedImport) {
			existingImport.addNamedImport(input.importDefinition)
		}
	} else {
		sourceFile.addImportDeclaration({
			namedImports: [input.importDefinition],
			moduleSpecifier,
		})
	}

	let arrayDeclaration = sourceFile.getVariableDeclaration('agentDefinitions')
	if (!arrayDeclaration) {
		const serviceBuilderImport = sourceFile.getImportDeclaration(declaration =>
			declaration.getNamedImports().some(namedImport => namedImport.getName() === input.serviceBuilderName),
		)
		sourceFile.insertVariableStatement(serviceBuilderImport ? serviceBuilderImport.getChildIndex() + 2 : 0, {
			declarationKind: VariableDeclarationKind.Const,
			declarations: [
				{
					name: 'agentDefinitions',
					type: `ReturnType<typeof ${input.importDefinition}['getDefinition']>[]`,
					initializer: '[]',
				},
			],
		})
		arrayDeclaration = sourceFile.getVariableDeclarationOrThrow('agentDefinitions')
	}

	const arrayLiteralExpression = arrayDeclaration.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression)
	if (!arrayLiteralExpression) {
		throw new Error(`Variable "agentDefinitions" is not an array literal in ${input.serviceFile}`)
	}

	const definitionExpression = `${input.importDefinition}.getDefinition()`
	const normalizedDefinitionExpression = definitionExpression.replace(/\s+/g, '')
	const alreadyDefined = arrayLiteralExpression.getElements().some(element => {
		const normalizedElement = element.getText().replace(/\s+/g, '')
		return normalizedElement === normalizedDefinitionExpression
	})
	if (!alreadyDefined) {
		arrayLiteralExpression.addElement(definitionExpression)
	}

	const serviceExport = sourceFile.getVariableDeclaration(
		declaration =>
			declaration.getName() !== input.serviceBuilderName &&
			(declaration.getInitializer()?.getText().startsWith(input.serviceBuilderName) ?? false),
	)
	if (serviceExport) {
		const statement = serviceExport.getVariableStatementOrThrow()
		const text = statement.getText()
		if (!text.includes('.addAgentDefinition(...agentDefinitions)')) {
			statement.replaceWithText(`${text}\n\t.addAgentDefinition(...(await Promise.all(agentDefinitions)))`)
		}
	}

	await sourceFile.save()
}

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
	const serviceEntry = input.puristaProject.services[input.serviceName][input.serviceVersion]
	const agentDirName = convertToProjectFileCasing(input.agentName, input.puristaConfig)
	const serviceBuilderTemplate = `${input.serviceName} v${input.serviceVersion} service builder`
	const serviceBuilderFileName = convertToProjectFileCasing(serviceBuilderTemplate, input.puristaConfig)
	const serviceBuilderName = camelCase(serviceBuilderTemplate)
	const agentPath = join(
		projectPath,
		serviceBasePath,
		input.serviceName,
		`v${input.serviceVersion}`,
		'agent',
		agentDirName,
	)

	if (existsSync(agentPath)) {
		throw new Error(`Agent "${input.agentName}" already exists for ${input.serviceName} v${input.serviceVersion}.`)
	}

	await mkdir(agentPath, { recursive: true })

	const serviceBuilderFilePath = join(projectPath, serviceBasePath, serviceEntry.builderFile)
	const serviceBuilderContent = await readFile(serviceBuilderFilePath, 'utf-8')
	const upgradedImportContent = serviceBuilderContent.replace(
		"import { ServiceBuilder } from '@purista/core'",
		"import { ServiceBuilder } from '@purista/ai'",
	)
	const normalizedBuilderContent = upgradedImportContent.replace(
		/export const (\w+) = new ServiceBuilder\(([^)]+)\)\.setConfigSchema\(([^)]+)\)\s*$/m,
		(_match, builderName: string, serviceInfoName: string, configSchemaName: string) =>
			`const ${builderName}Instance = new ServiceBuilder(${serviceInfoName})\n${builderName}Instance.setConfigSchema(${configSchemaName})\n\nexport const ${builderName} = ${builderName}Instance`,
	)
	if (normalizedBuilderContent !== serviceBuilderContent) {
		await writeFile(serviceBuilderFilePath, normalizedBuilderContent)
	}

	const agentIdentifier = /agent$/i.test(input.agentName) ? input.agentName : `${input.agentName} agent`
	const builderFileName = convertToProjectFileCasing(agentIdentifier, input.puristaConfig)
	const builderImportName = `./${builderFileName}.js`
	const agentBuilderName = `${camelCase(agentIdentifier)}Builder`

	await writeFile(
		join(agentPath, `${builderFileName}.ts`),
		getAgentBuilderFileContent({
			agentName: input.agentName,
			agentDescription: input.agentDescription,
			serviceName: input.serviceName,
			serviceVersion: input.serviceVersion,
			responseEventName: input.responseEventName,
			puristaConfig: input.puristaConfig,
			codeWriterOptions: input.codeWriterOptions,
		}),
	)

	await writeFile(
		join(agentPath, `${builderFileName}.test.ts`),
		getAgentTestFileContent({
			agentName: input.agentName,
			builderImportName,
			codeWriterOptions: input.codeWriterOptions,
		}),
	)

	await writeFile(
		join(agentPath, 'index.ts'),
		`export { ${agentBuilderName} } from './${builderFileName}.js'\n`,
	)

	await addAgentDefinitionToService({
		serviceFile: join(projectPath, serviceBasePath, serviceEntry.serviceFile),
		importFile: `./agent/${agentDirName}/${builderFileName}.ts`,
		importDefinition: agentBuilderName,
		serviceBuilderName,
	})

	return
}
