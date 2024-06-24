import type { CommandDefinitionList, SubscriptionDefinitionList } from '@purista/core'

import { createUserCommandBuilder } from './command/createUser/createUserCommandBuilder.js'
import { registerCommandBuilder } from './command/register/registerCommandBuilder.js'
import { userV1ServiceBuilder } from './userV1ServiceBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./userServiceBuilder.ts file

const commandDefinitions: CommandDefinitionList<any> = [
	createUserCommandBuilder.getDefinition(),
	registerCommandBuilder.getDefinition(),
]

const subscriptionDefinitions: SubscriptionDefinitionList<any> = []

export const userV1Service = userV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
