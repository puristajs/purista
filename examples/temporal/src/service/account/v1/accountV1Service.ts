import type { CommandDefinitionList, SubscriptionDefinitionList } from '@purista/core'

import { accountV1ServiceBuilder } from './accountV1ServiceBuilder.js'
import { createAccountCommandBuilder } from './command/createAccount/createAccountCommandBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./accountServiceBuilder.ts file

const commandDefinitions: CommandDefinitionList<any> = [createAccountCommandBuilder.getDefinition()]

const subscriptionDefinitions: SubscriptionDefinitionList<any> = []

export const accountV1Service = accountV1ServiceBuilder
  .addCommandDefinition(...commandDefinitions)
  .addSubscriptionDefinition(...subscriptionDefinitions)
