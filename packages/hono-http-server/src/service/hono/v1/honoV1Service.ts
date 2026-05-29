import { honoV1ServiceBuilder } from './honoV1ServiceBuilder.js'
import { serviceCommandsToRestApiSubscriptionBuilder } from './subscription/serviceCommandsToRestApi/serviceCommandsToRestApiSubscriptionBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./honoServiceBuilder.ts file

type CommandDefinition = Parameters<typeof honoV1ServiceBuilder.addCommandDefinition>[number]
type SubscriptionDefinition = Parameters<typeof honoV1ServiceBuilder.addSubscriptionDefinition>[number]

const commandDefinitions: CommandDefinition[] = []

const subscriptionDefinitions: SubscriptionDefinition[] = [serviceCommandsToRestApiSubscriptionBuilder.getDefinition()]

/**
 * Built-in Hono HTTP service definition.
 *
 * Create an instance with `honoV1Service.getInstance(eventBridge, ...)`, then
 * register PURISTA services before starting and passing `honoService.app.fetch`
 * to a Hono runtime adapter.
 */
export const honoV1Service = honoV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
