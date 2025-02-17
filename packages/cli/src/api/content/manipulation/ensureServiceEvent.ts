import { join } from 'node:path'

import { Project } from 'ts-morph'
import { pascalCase } from '../../change-case.js'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'
import type { PuristaProjectInfo } from '../../scanPuristaProject.js'

/**
 * Adds a new event to the global service event enum
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
	const project = new Project({
		tsConfigFilePath,
	})

	const enumFile = join(input.puristaProjectConfig.servicePath, input.puristaProject.eventEnumFileName)

	const sourceFile = project.addSourceFileAtPathIfExists(enumFile)

	if (!sourceFile) {
		throw new Error(`${enumFile} could not be found`)
	}

	const serviceEventEnum = sourceFile.getEnum('ServiceEvent')

	if (!serviceEventEnum) {
		throw new Error('enum ServiceEvent could not be found')
	}

	const enumValue = convertToProjectEventCasing(input.eventName, input.puristaProjectConfig)
	const enumName = pascalCase(input.eventName)

	const existingEntries = serviceEventEnum.getMembers()

	const alreadyExist = existingEntries.find(member => member.getName() === enumName || member.getValue() === enumValue)

	if (alreadyExist) {
		return alreadyExist.getName()
	}

	const member = serviceEventEnum.addMember({ name: enumName, value: enumValue })
	if (input.description) {
		member.addJsDoc(input.description)
	}

	await sourceFile.save()
	return enumName
}
