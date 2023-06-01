import { CommandDefinitionList, SubscriptionDefinitionList } from '@purista/core'

import { pingCommandBuilder } from './command/ping'
import { pingV1ServiceBuilder } from './pingV1ServiceBuilder'
import { logSubscriptionBuilder } from './subscription/log'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./pingServiceBuilder.ts file

const commandDefinitions: CommandDefinitionList<any> = [pingCommandBuilder.getDefinition()]

const subscriptionDefinitions: SubscriptionDefinitionList<any> = [logSubscriptionBuilder.getDefinition()]

export const pingV1Service = pingV1ServiceBuilder
  .addCommandDefinition(...commandDefinitions)
  .addSubscriptionDefinition(...subscriptionDefinitions)
