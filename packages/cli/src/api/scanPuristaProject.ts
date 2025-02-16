import { readdir } from 'node:fs/promises'
import { join, sep } from 'node:path'
import { camelCase } from 'change-case'

import { getEventNames } from './getEventNames.js'
import type { PuristaConfig } from './loadPuristaConfig.js'

const matchVersionRegex = /^\D*(\d+)$/i

/**
 * Information about a service.
 * It is a nested object.
 * The top level key is the service name, the value is a nested object, where the keys are the versions of the service.
 * [serviceName][serviceVersion] is an object that contains:
 * - `commands`: An array of strings representing the command names available for the service.
 * - `subscriptions`: An array of strings representing the subscription names available for the service.
 * - `builderFile`: The path to the builder file for the service.
 * - `serviceFile`: The path to the service file for the service.
 */
export type PuristaProjectServices = Record<
	string,
	Record<string, { commands: string[]; subscriptions: string[]; builderFile: string; serviceFile: string }>
>

/**
 * Information about a Purista project.
 */
export type PuristaProjectInfo = {
	/** The information about existing services */
	services: PuristaProjectServices
	/** List of event names and their corresponding values  */
	eventNames: { name: string; value: string }[]
	/** The file name of the file that contains the event enum  */
	eventEnumFileName: string
}

/**
 * Walk through the file and folder structure and extract the existing services with their commands and subscriptions.
 */
export const scanPuristaProject = async (
	puristaConfig: PuristaConfig,
	projectRootPath?: string,
): Promise<PuristaProjectInfo> => {
	const projectPath = projectRootPath ?? process.cwd()
	const servicePath = join(projectPath, puristaConfig.servicePath)

	const result: PuristaProjectInfo = {
		services: {},
		eventNames: [],
		eventEnumFileName: '',
	}

	const files = await readdir(servicePath, { recursive: true })
	for (const file of files) {
		const splitPath = file.split(sep)

		if (splitPath.length === 1) {
			const unifiedFileName = camelCase(splitPath[0], { suffixCharacters: '.enum.ts' })
			if (unifiedFileName === 'serviceEvent.enum.ts') {
				result.eventEnumFileName = splitPath[0]
				result.eventNames = getEventNames(puristaConfig, result.eventEnumFileName)
			}
			continue
		}

		if (splitPath.length < 2) {
			continue
		}

		const serviceName = splitPath[0]
		const serviceVersion = splitPath[1].match(matchVersionRegex)?.[1]

		if (!serviceVersion) {
			continue
		}

		result.services[serviceName] = {
			...result.services[serviceName],
			[serviceVersion]: {
				...(result.services[serviceName]?.[serviceVersion] ?? {
					commands: [],
					subscriptions: [],
					builderFile: '',
					serviceFile: '',
				}),
			},
		}

		if (splitPath.length === 3) {
			const unifiedFileName = camelCase(splitPath[2], { suffixCharacters: '.ts' })

			if (unifiedFileName.endsWith(`${serviceVersion}ServiceBuilder.ts`)) {
				result.services[serviceName][serviceVersion].builderFile = file
			}
			if (unifiedFileName.endsWith(`${serviceVersion}Service.ts`)) {
				result.services[serviceName][serviceVersion].serviceFile = file
			}
		}
	}

	return result
}
