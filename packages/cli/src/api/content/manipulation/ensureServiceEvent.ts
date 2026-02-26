import { isAbsolute, join } from 'node:path'
import { ObjectLiteralExpression, Project, type PropertyAssignment, type SourceFile, SyntaxKind } from 'ts-morph'
import { pascalCase } from '../../change-case.js'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'
import type { PuristaProjectInfo } from '../../scanPuristaProject.js'

/**
 * Adds a new event to the global service event enum or an object if the enum does not exist.
 */
export const ensureServiceEvent = async (input: {
	projectRootPath?: string
	puristaProjectConfig: PuristaConfig
	puristaProject: PuristaProjectInfo
	eventName: string | undefined
	description?: string
}) => {
	if (!input.eventName?.trim().length || !input.puristaProject.eventEnumFileName.trim().length) {
		return
	}

	const projectRootPath = input.projectRootPath ?? process.cwd()
	const tsConfigFilePath = join(projectRootPath, 'tsconfig.json')
	const project = new Project({ tsConfigFilePath })

	const serviceRoot = isAbsolute(input.puristaProjectConfig.servicePath)
		? input.puristaProjectConfig.servicePath
		: join(projectRootPath, input.puristaProjectConfig.servicePath)

	const enumFile = join(serviceRoot, input.puristaProject.eventEnumFileName)
	const sourceFile = project.addSourceFileAtPathIfExists(enumFile)

	if (!sourceFile) {
		throw new Error(`${enumFile} could not be found`)
	}

	const enumName = pascalCase(input.eventName)
	const enumValue = convertToProjectEventCasing(input.eventName, input.puristaProjectConfig)

	// Try adding to enum first
	const result = addToEnum(sourceFile, enumName, enumValue, input.description)
	if (result) {
		await sourceFile.save()
		return result
	}

	// If no enum exists, try adding to object
	const objectResult = addToObject(sourceFile, enumName, enumValue, input.description)
	if (objectResult) {
		await sourceFile.save()
		return objectResult
	}

	throw new Error('Neither enum nor object ServiceEvent found')
}

/**
 * Adds a new entry to the `ServiceEvent` enum if it exists.
 */
const addToEnum = (
	sourceFile: SourceFile,
	enumName: string,
	enumValue: string,
	description?: string,
): string | undefined => {
	const serviceEventEnum = sourceFile.getEnum('ServiceEvent')

	if (!serviceEventEnum) return undefined

	const existingEntries = serviceEventEnum.getMembers()
	const alreadyExist = existingEntries.find(member => member.getName() === enumName || member.getValue() === enumValue)

	if (alreadyExist) {
		return alreadyExist.getName()
	}

	const member = serviceEventEnum.addMember({ name: enumName, value: enumValue })
	if (description) {
		member.addJsDoc(description)
	}

	return enumName
}

/**
 * Adds a new entry to the `ServiceEvent` object if it exists.
 */
const addToObject = (
	sourceFile: SourceFile,
	enumName: string,
	enumValue: string,
	description?: string,
): string | undefined => {
	// Find ALL variable declarations
	const allVariableDeclarations = sourceFile.getVariableDeclarations()

	// Search manually for the correct variable (handles `export const ServiceEvent = {} as const;`)
	const serviceEventVar = allVariableDeclarations.find(decl => decl.getName() === 'ServiceEvent')

	if (!serviceEventVar) return undefined

	let initializer = serviceEventVar.getInitializer()

	// If the initializer is wrapped in `as const`, unwrap it
	if (initializer?.isKind(SyntaxKind.AsExpression)) {
		initializer = initializer.getFirstChildByKind(SyntaxKind.ObjectLiteralExpression)
	}

	if (!(initializer instanceof ObjectLiteralExpression)) return undefined

	const existingProperty = initializer.getProperty(enumName) as PropertyAssignment | undefined
	if (existingProperty) {
		return existingProperty.getName()
	}

	// Add new property to the object
	const newProperty = initializer.addPropertyAssignment({
		name: enumName,
		initializer: JSON.stringify(enumValue),
	})

	// Add JSDoc comment manually if provided
	if (description) {
		const insertPos = newProperty.getStart()
		sourceFile.insertText(insertPos, `/** ${description} */\n`)
	}

	return enumName
}
