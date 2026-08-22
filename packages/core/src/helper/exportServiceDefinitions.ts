import type { AgentManifest } from '../AgentQueueBuilder/types.js'
import type { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { puristaVersion } from '../version.js'
import type { FullDefinition } from './types/FullDefinition.js'
import type { FullServiceDefinition } from './types/FullServiceDefinition.js'
import type { ServiceDefinitions } from './types/ServiceDefinitions.js'

/**
 * Merge service definitions into one big full service definition structure
 * @param existing
 * @param definitionToAdd
 * @returns
 */
export const mergeServiceDefinition = <T extends FullServiceDefinition>(
	existing: FullServiceDefinition,
	definitionToAdd: ServiceDefinitions,
): T => {
	const commands = definitionToAdd.commands.reduce((current, definition) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: small map construction
			...current,
			[definition.commandName]: definition,
		}
	}, {})

	const subscriptions = definitionToAdd.subscriptions.reduce((current, definition) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: small map construction
			...current,
			[definition.subscriptionName]: definition,
		}
	}, {})
	const streams = (definitionToAdd.streams ?? []).reduce((current, definition) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: small map construction
			...current,
			[definition.streamName]: definition,
		}
	}, {})
	const queues = (definitionToAdd.queues ?? []).reduce((current, definition) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: small map construction
			...current,
			[definition.queueName]: definition,
		}
	}, {})
	const queueWorkers = (definitionToAdd.queueWorkers ?? []).reduce((current, definition) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: small map construction
			...current,
			[definition.name]: definition,
		}
	}, {})
	const agents: Record<string, AgentManifest> = {}
	for (const definition of definitionToAdd.agents ?? []) {
		agents[definition.agentName] = definition
	}
	const commandSchedules = definitionToAdd.commands.flatMap(definition => definition.schedules ?? [])
	const queueSchedules = (definitionToAdd.queues ?? []).flatMap(definition => definition.schedules ?? [])
	const schedules = [...(definitionToAdd.schedules ?? []), ...commandSchedules, ...queueSchedules].reduce(
		(current, definition) => {
			return {
				// biome-ignore lint/performance/noAccumulatingSpread: small map construction
				...current,
				[definition.name]: {
					...definition,
					targetServiceName: definition.targetServiceName ?? definitionToAdd.serviceName,
					targetServiceVersion: definition.targetServiceVersion ?? definitionToAdd.serviceVersion,
				},
			}
		},
		{},
	)

	const ret = { ...existing }
	const currentServiceName = ret[definitionToAdd.serviceName] ?? {}
	const currentVersion = currentServiceName[definitionToAdd.serviceVersion]

	ret[definitionToAdd.serviceName] = {
		...currentServiceName,
		[definitionToAdd.serviceVersion]: {
			description: currentVersion?.description ?? definitionToAdd.serviceDescription,
			deprecated: currentVersion?.deprecated ?? definitionToAdd.deprecated,
			commands: { ...commands, ...currentVersion?.commands },
			subscriptions: { ...subscriptions, ...currentVersion?.subscriptions },
			streams: { ...streams, ...currentVersion?.streams },
			queues: { ...queues, ...currentVersion?.queues },
			queueWorkers: { ...queueWorkers, ...currentVersion?.queueWorkers },
			...(Object.keys(agents).length > 0 || Object.keys(currentVersion?.agents ?? {}).length > 0
				? { agents: { ...agents, ...currentVersion?.agents } }
				: {}),
			schedules: { ...schedules, ...currentVersion?.schedules },
			eventToQueueBindings: [
				...(definitionToAdd.eventToQueueBindings ?? []),
				...(currentVersion?.eventToQueueBindings ?? []),
			],
		},
	}

	return ret as T
}

/**
 * Resolve service builders into the JSON-safe definition inventory used by
 * architecture inspection and interoperability exports.
 *
 * Keep this in an application composition module that imports builders only;
 * it must not instantiate service runtime dependencies or handlers.
 *
 * @example
 * ```ts
 * const definitions = await exportServiceDefinitions([ordersV1Service, billingV1Service])
 * await writeFile('purista.definitions.json', JSON.stringify(definitions, null, 2))
 * ```
 */
export const exportServiceDefinitions = async (
	serviceBuilders: readonly ServiceBuilder<any>[],
): Promise<FullDefinition> => {
	const serviceDefinitions = await Promise.all(serviceBuilders.map(builder => builder.getFullServiceDefinition()))

	return {
		version: puristaVersion,
		services: serviceDefinitions.reduce((def, current) => mergeServiceDefinition(def, current), {}),
	}
}
