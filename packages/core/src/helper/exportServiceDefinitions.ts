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
		},
	}

	return ret as T
}

/**
 * Exports the service definitions.
 * Includes the information about commands and subscriptions.
 *
 * The output can be saved as JSON string in a file.
 *
 * @param serviceBuilders
 * @returns
 */
export const exportServiceDefinitions = async (serviceBuilders: ServiceBuilder[]): Promise<FullDefinition> => {
	const serviceDefinitions = await Promise.all(serviceBuilders.map(builder => builder.getFullServiceDefinition()))

	return {
		version: puristaVersion,
		services: serviceDefinitions.reduce((def, current) => mergeServiceDefinition(def, current), {}),
	}
}
