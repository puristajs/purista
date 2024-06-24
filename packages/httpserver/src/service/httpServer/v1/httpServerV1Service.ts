import type { CommandDefinitionList, SubscriptionDefinitionList } from '@purista/core'

import { httpServerV1ServiceBuilder } from './httpServerV1ServiceBuilder.js'
import { serviceCommandsToRestApiSubscriptionBuilder } from './subscription/serviceCommandsToRestApi/index.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./httpServerServiceBuilder.ts file

const commandDefinitions: CommandDefinitionList<any> = []

const subscriptionDefinitions: SubscriptionDefinitionList<any> = [
	serviceCommandsToRestApiSubscriptionBuilder.getDefinition(),
]

/**
 * @deprecated Since version 1.10.0. Use {@purista/hono-http-server} instead.
 */
export const httpServerV1Service = httpServerV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
