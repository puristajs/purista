import { join } from 'node:path'

import { Project } from 'ts-morph'
import type { PuristaConfig } from './loadPuristaConfig.js'

export let eventNames: { name: string; value: string }[]
export const getEventNames = (
	puristaConfig: PuristaConfig,
	eventEnumFileName: string,
): { name: string; value: string }[] => {
	if (eventNames) {
		return eventNames
	}
	try {
		const tsConfigFilePath = join(process.cwd(), 'tsconfig.json')
		const project = new Project({
			tsConfigFilePath,
		})

		const enumFile = join(puristaConfig.servicePath, eventEnumFileName)

		const sourceFile = project.addSourceFileAtPathIfExists(enumFile)

		if (!sourceFile) {
			eventNames = []
			return eventNames
		}

		const serviceEventEnum = sourceFile.getEnum('ServiceEvent')

		if (!serviceEventEnum) {
			eventNames = []
			return eventNames
		}

		eventNames = serviceEventEnum
			.getMembers()
			.map(member => ({ value: member.getValue() as string, name: member.getValue() as string }))
			.sort((a, b) => {
				if (a.value < b.value) {
					return -1
				}
				if (a.value > b.value) {
					return 1
				}
				return 0
			})

		return eventNames
	} catch (error) {
		eventNames = []
		return eventNames
	}
}
