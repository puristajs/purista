import {
	createProjectSnapshot,
	type ProjectSnapshot,
	type ServiceVersionSnapshot,
} from '../project/createProjectSnapshot.js'
import type { PuristaConfig } from './loadPuristaConfig.js'

/** Public service scan result used by legacy generator helpers. */
export type PuristaProjectServices = Record<
	string,
	Record<string, Omit<ServiceVersionSnapshot, 'queues' | 'queueWorkers'>>
>

/** Public project information required by scaffolding helpers. */
export type PuristaProjectInfo = {
	/** Services keyed by generated service directory and version. */
	services: PuristaProjectServices
	/** Known ServiceEvent entries sorted by event value. */
	eventNames: { name: string; value: string }[]
	/** ServiceEvent enum/object file name relative to `puristaConfig.servicePath`. */
	eventEnumFileName: string
}

/**
 * Scan a PURISTA project for service, command, subscription, stream, and event metadata.
 *
 * Queue and agent metadata is available through `createProjectSnapshot`; this helper
 * keeps the historical public shape used by service artifact generators.
 */
export const scanPuristaProject = async (
	puristaConfig: PuristaConfig,
	projectRootPath?: string,
): Promise<PuristaProjectInfo> => {
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
