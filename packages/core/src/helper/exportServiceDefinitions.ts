import type { ServiceBuilder } from '../ServiceBuilder/index.js'
import { puristaVersion } from '../version.js'
import type { FullDefinition } from './types/FullDefinition.js'
import type { FullServiceDefinition } from './types/FullServiceDefinition.js'
import type { ServiceDefinitions } from './types/ServiceDefinitions.js'

/**
 * Merge service definitions onto one big object structure
 * @param existing
 * @param defintionToAdd
 * @returns
 */
const mergeServiceDefintion = <T extends FullServiceDefinition>(
  existing: FullServiceDefinition,
  defintionToAdd: ServiceDefinitions,
): T => {
  const commands = defintionToAdd.commands.reduce((current, definition) => {
    return {
      ...current,
      [definition.commandName]: definition,
    }
  }, {})

  const subscriptions = defintionToAdd.subscriptions.reduce((current, definition) => {
    return {
      ...current,
      [definition.subscriptionName]: definition,
    }
  }, {})

  const ret = { ...existing }

  if (!ret[defintionToAdd.serviceName]) {
    ret[defintionToAdd.serviceName] = {
      [defintionToAdd.serviceVersion]: {
        description: defintionToAdd.serviceDescription,
        commands,
        subscriptions,
        deprecated: defintionToAdd.deprecated,
      },
    }
  }

  if (!ret[defintionToAdd.serviceName][defintionToAdd.serviceVersion]) {
    ret[defintionToAdd.serviceName][defintionToAdd.serviceVersion] = {
      description: defintionToAdd.serviceDescription,
      commands,
      subscriptions,
      deprecated: defintionToAdd.deprecated,
    }
  }

  ret[defintionToAdd.serviceName][defintionToAdd.serviceVersion] = {
    ...ret[defintionToAdd.serviceName][defintionToAdd.serviceVersion],
    description: defintionToAdd.serviceDescription,
    commands,
    subscriptions,
    deprecated: defintionToAdd.deprecated,
  }

  return ret as T
}

/**
 * Exports the service definitions.
 * Includes the information about commands and subscriptions.
 *
 * The output can be saves as JSON string in a file.
 *
 * @param serviceBuilders
 * @returns
 */
export const exportServiceDefinitions = async (serviceBuilders: ServiceBuilder[]): Promise<FullDefinition> => {
  const serviceDefinitions = await Promise.all(serviceBuilders.map((builder) => builder.getFullServiceDefintion()))

  return {
    version: puristaVersion,
    services: serviceDefinitions.reduce((def, current) => mergeServiceDefintion(def, current), {}),
  }
}
