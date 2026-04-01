import { readdir } from 'node:fs/promises'
import { join, sep } from 'node:path'
import { camelCase } from '../api/change-case.js'
import { getEventNames } from '../api/getEventNames.js'
import type { PuristaConfig } from '../api/loadPuristaConfig.js'

const matchVersionRegex = /^\D*(\d+)$/i

export type ServiceVersionSnapshot = {
	commands: string[]
	subscriptions: string[]
	streams: string[]
	queues: string[]
	queueWorkers: string[]
	builderFile: string
	serviceFile: string
}

export type ProjectSnapshot = {
	services: Record<string, Record<string, ServiceVersionSnapshot>>
	agents: Record<string, string[]>
	eventNames: { name: string; value: string }[]
	eventEnumFileName: string
}

const createEmptyServiceVersionSnapshot = (): ServiceVersionSnapshot => ({
	commands: [],
	subscriptions: [],
	streams: [],
	queues: [],
	queueWorkers: [],
	builderFile: '',
	serviceFile: '',
})

const pushUnique = (target: string[], value: string) => {
	if (!target.includes(value)) {
		target.push(value)
	}
}

export const createProjectSnapshot = async (
	puristaConfig: PuristaConfig,
	projectRootPath?: string,
): Promise<ProjectSnapshot> => {
	const projectPath = projectRootPath ?? process.cwd()
	const servicePath = join(projectPath, puristaConfig.servicePath)
	const result: ProjectSnapshot = {
		services: {},
		agents: {},
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
				result.eventNames = getEventNames(puristaConfig, result.eventEnumFileName, projectPath)
			}
			continue
		}

		const serviceName = splitPath[0]
		const serviceVersion = splitPath[1].match(matchVersionRegex)?.[1]
		if (!serviceVersion) {
			continue
		}

		result.services[serviceName] = result.services[serviceName] ?? {}
		result.services[serviceName][serviceVersion] =
			result.services[serviceName][serviceVersion] ?? createEmptyServiceVersionSnapshot()
		const versionEntry = result.services[serviceName][serviceVersion]

		if (splitPath.length === 3) {
			const unifiedFileName = camelCase(splitPath[2], { suffixCharacters: '.ts' })
			if (unifiedFileName.endsWith(`${serviceVersion}ServiceBuilder.ts`)) {
				versionEntry.builderFile = file
			}
			if (unifiedFileName.endsWith(`${serviceVersion}Service.ts`)) {
				versionEntry.serviceFile = file
			}
			continue
		}

		if (splitPath.length >= 4) {
			const category = camelCase(splitPath[2])
			const entryName = splitPath[3]
			if (category === 'command') {
				pushUnique(versionEntry.commands, entryName)
			}
			if (category === 'subscription') {
				pushUnique(versionEntry.subscriptions, entryName)
			}
			if (category === 'stream') {
				pushUnique(versionEntry.streams, entryName)
			}
			if (category === 'queue') {
				pushUnique(versionEntry.queues, entryName)
			}
			if (category === 'queueWorker') {
				pushUnique(versionEntry.queueWorkers, entryName)
			}
		}
	}

	const agentsBasePath = join(projectPath, puristaConfig.agentPath ?? 'src/agents')
	try {
		const agentFiles = await readdir(agentsBasePath, { recursive: true })
		for (const file of agentFiles) {
			const splitPath = file.split(sep)
			if (splitPath.length < 2) {
				continue
			}
			const agentName = splitPath[0]
			const version = splitPath[1].match(matchVersionRegex)?.[1]
			if (!version) {
				continue
			}
			result.agents[agentName] = result.agents[agentName] ?? []
			pushUnique(result.agents[agentName], version)
		}
	} catch {
		// Agents are optional.
	}

	return result
}
