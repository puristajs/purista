import { CommandDefinitionList, SubscriptionDefinitionList } from '@purista/core'

import { httpServerV1ServiceBuilder } from './httpServerV1ServiceBuilder'
import { serviceCommandsToRestApiSubscriptionBuilder } from './subscription/serviceCommandsToRestApi'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./httpServerServiceBuilder.ts file

const commandDefinitions: CommandDefinitionList<any> = []

const subscriptionDefinitions: SubscriptionDefinitionList<any> = [
  serviceCommandsToRestApiSubscriptionBuilder.getDefinition(),
]

export const httpServerV1Service = httpServerV1ServiceBuilder
  .addCommandDefinition(...commandDefinitions)
  .addSubscriptionDefinition(...subscriptionDefinitions)
