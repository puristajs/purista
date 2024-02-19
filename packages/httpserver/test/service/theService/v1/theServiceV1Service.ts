import type { CommandDefinitionList, SubscriptionDefinitionList } from '@purista/core'

import { deleteCommandBuilder } from './command/delete/index.js'
import { errorCommandBuilder } from './command/error/index.js'
import { patchCommandBuilder } from './command/patch/index.js'
import { pingCommandBuilder } from './command/ping/index.js'
import { postCommandBuilder } from './command/post/index.js'
import { putCommandBuilder } from './command/put/index.js'
import { theServiceServiceBuilder } from './theServiceServiceBuilder.js'

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
