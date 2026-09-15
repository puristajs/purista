import { existsSync } from 'node:fs'
import { IndentationText, Project, QuoteKind, SyntaxKind } from 'ts-morph'
import { camelCase } from '../../change-case.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

type EnsureQueueCollectionsInput = {
	serviceFile: string
	serviceName: string
	serviceVersion: string
	puristaConfig: PuristaConfig
}

export const ensureQueueCollections = async (input: EnsureQueueCollectionsInput) => {
	if (!existsSync(input.serviceFile)) {
		throw new Error(`Service file not found: ${input.serviceFile}`)
	}

	const project = new Project({
		manipulationSettings: {
			indentationText: IndentationText.Tab,
			quoteKind: QuoteKind.Single,
		},
		skipFileDependencyResolution: true,
		skipLoadingLibFiles: true,
	})
	const sourceFile = project.addSourceFileAtPathIfExists(input.serviceFile)
	if (!sourceFile) {
		throw new Error(`Failed to load service file: ${input.serviceFile}`)
	}

	const serviceBuilderName = camelCase(`${input.serviceName} v${input.serviceVersion} service builder`)
	const serviceConstName = camelCase(`${input.serviceName} v${input.serviceVersion} service`)

	const ensureTypeAlias = (name: string, typeText: string) => {
		if (sourceFile.getTypeAlias(name)) {
			return
		}

		const statements = sourceFile.getStatements()
		const typeAliases = sourceFile.getTypeAliases()
		const insertIndex =
			typeAliases.length > 0
				? statements.indexOf(typeAliases[typeAliases.length - 1]) + 1
				: sourceFile.getImportDeclarations().length

		sourceFile.insertStatements(insertIndex, writer => {
			writer.writeLine(`type ${name} = ${typeText}`)
		})
	}

	const serviceDeclaration = sourceFile.getVariableDeclaration(serviceConstName)
	const serviceStatement = serviceDeclaration?.getFirstAncestorByKind(SyntaxKind.VariableStatement)

	const ensureConstArray = (identifier: string, typeName: string) => {
		if (sourceFile.getVariableDeclaration(identifier)) {
			return
		}
		const statements = sourceFile.getStatements()
		const insertIndex = serviceStatement ? statements.indexOf(serviceStatement) : statements.length
		sourceFile.insertStatements(insertIndex, writer => {
			writer.writeLine(`const ${identifier}: ${typeName}[] = []`)
		})
	}

	const ensureBuilderChain = () => {
		if (!serviceDeclaration) {
			throw new Error(`Variable "${serviceConstName}" not found in ${input.serviceFile}`)
		}
		const initializerText = serviceDeclaration.getInitializer()?.getText() ?? serviceBuilderName
		let nextText = initializerText

		if (!nextText.includes('.addQueueDefinition(')) {
			nextText = `${nextText}\n\t.addQueueDefinition(...queueDefinitions)`
		}

		if (!nextText.includes('.addQueueWorkerDefinition(')) {
			nextText = `${nextText}\n\t.addQueueWorkerDefinition(...queueWorkerDefinitions)`
		}

		if (nextText !== initializerText) {
			serviceDeclaration.setInitializer(nextText)
		}
	}

	ensureTypeAlias('QueueDefinition', `Parameters<typeof ${serviceBuilderName}['addQueueDefinition']>[number]`)
	ensureTypeAlias(
		'QueueWorkerDefinition',
		`Parameters<typeof ${serviceBuilderName}['addQueueWorkerDefinition']>[number]`,
	)
	ensureConstArray('queueDefinitions', 'QueueDefinition')
	ensureConstArray('queueWorkerDefinitions', 'QueueWorkerDefinition')
	ensureBuilderChain()

	await sourceFile.save()
}
