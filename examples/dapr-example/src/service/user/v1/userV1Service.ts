import type { CommandDefinitionList, SubscriptionDefinitionList } from '@purista/core'

import { computeDataCommandBuilder } from './command/computeData'
import { getAllUsersCommandBuilder } from './command/getAllUsers'
import { getUserByIdCommandBuilder } from './command/getUserById'
import { pingCommandBuilder } from './command/ping'
import { signUpCommandBuilder } from './command/signUp'
import { userV1ServiceBuilder } from './userV1ServiceBuilder'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./userServiceBuilder.ts file

const commandDefinitions: CommandDefinitionList<any> = [
  signUpCommandBuilder.getDefinition(),
  getUserByIdCommandBuilder.getDefinition(),
  getAllUsersCommandBuilder.getDefinition(),
  pingCommandBuilder.getDefinition(),
  computeDataCommandBuilder.getDefinition(),
]

const subscriptionDefinitions: SubscriptionDefinitionList<any> = []

export const userV1Service = userV1ServiceBuilder
  .addCommandDefinition(...commandDefinitions)
  .addSubscriptionDefinition(...subscriptionDefinitions)
