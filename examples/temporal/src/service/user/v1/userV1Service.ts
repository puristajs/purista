import { createUserCommandBuilder } from './command/createUser/createUserCommandBuilder.js'
import { registerCommandBuilder } from './command/register/registerCommandBuilder.js'
import { userV1ServiceBuilder } from './userV1ServiceBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./userServiceBuilder.ts file

type CommandDefinition = Parameters<typeof userV1ServiceBuilder.addCommandDefinition>[number]
type SubscriptionDefinition = Parameters<typeof userV1ServiceBuilder.addSubscriptionDefinition>[number]

const commandDefinitions: CommandDefinition[] = [
	createUserCommandBuilder.getDefinition(),
	registerCommandBuilder.getDefinition(),
]

const subscriptionDefinitions: SubscriptionDefinition[] = []

export const userV1Service = userV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
