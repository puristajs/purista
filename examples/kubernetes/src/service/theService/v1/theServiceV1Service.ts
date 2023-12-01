import type { CommandDefinitionList, SubscriptionDefinitionList } from '@purista/core'

import { pingCommandBuilder } from './command/ping'
import { theServiceServiceBuilder } from './theServiceServiceBuilder'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./theServiceServiceBuilder.ts file

const commandDefinitions: CommandDefinitionList<any> = [pingCommandBuilder.getDefinition()]

const subscriptionDefinitions: SubscriptionDefinitionList<any> = []

export const theServiceV1Service = theServiceServiceBuilder
  .addCommandDefinition(...commandDefinitions)
  .addSubscriptionDefinition(...subscriptionDefinitions)
