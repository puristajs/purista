import type { CommandDefinitionList, SubscriptionDefinitionList } from '@purista/core'

import { honoV1ServiceBuilder } from './honoV1ServiceBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./honoServiceBuilder.ts file

const commandDefinitions: CommandDefinitionList<any> = []

const subscriptionDefinitions: SubscriptionDefinitionList<any> = []

export const honoV1Service = honoV1ServiceBuilder
  .addCommandDefinition(...commandDefinitions)
  .addSubscriptionDefinition(...subscriptionDefinitions)
