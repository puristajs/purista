import type { PuristaConfig } from './loadPuristaConfig.js'
import { createProjectSnapshot, type ProjectSnapshot, type ServiceVersionSnapshot } from '../project/createProjectSnapshot.js'

export type PuristaProjectServices = Record<string, Record<string, Omit<ServiceVersionSnapshot, 'queues' | 'queueWorkers'>>>

export type PuristaProjectInfo = {
	services: PuristaProjectServices
	eventNames: { name: string; value: string }[]
	eventEnumFileName: string
}

export const scanPuristaProject = async (puristaConfig: PuristaConfig, projectRootPath?: string): Promise<PuristaProjectInfo> => {
	const snapshot = await createProjectSnapshot(puristaConfig, projectRootPath)
	const services = Object.fromEntries(
		Object.entries(snapshot.services).map(([serviceName, versions]) => [
			serviceName,
			Object.fromEntries(
				Object.entries(versions).map(([serviceVersion, definition]) => [
					serviceVersion,
					{
						commands: definition.commands,
						subscriptions: definition.subscriptions,
						streams: definition.streams,
						builderFile: definition.builderFile,
						serviceFile: definition.serviceFile,
					},
				]),
			),
		]),
	)

	return {
		services,
		eventNames: snapshot.eventNames,
		eventEnumFileName: snapshot.eventEnumFileName,
	}
}

export type { ProjectSnapshot }
