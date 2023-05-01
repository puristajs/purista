import { CommandDefinitionList, SubscriptionDefinitionList } from '@purista/core'

import { deleteCommandBuilder } from './command/delete'
import { errorCommandBuilder } from './command/error'
import { patchCommandBuilder } from './command/patch'
import { pingCommandBuilder } from './command/ping'
import { postCommandBuilder } from './command/post'
import { putCommandBuilder } from './command/put'
import { theServiceServiceBuilder } from './theServiceServiceBuilder'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./theServiceServiceBuilder.ts file

const commandDefinitions: CommandDefinitionList<any> = [
  pingCommandBuilder.getDefinition(),
  postCommandBuilder.getDefinition(),
  putCommandBuilder.getDefinition(),
  patchCommandBuilder.getDefinition(),
  deleteCommandBuilder.getDefinition(),
  errorCommandBuilder.getDefinition(),
]

const subscriptionDefinitions: SubscriptionDefinitionList<any> = []

export const theServiceV1Service = theServiceServiceBuilder
  .addCommandDefinition(...commandDefinitions)
  .addSubscriptionDefinition(...subscriptionDefinitions)
