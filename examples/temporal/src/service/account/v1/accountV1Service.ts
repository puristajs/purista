import { accountV1ServiceBuilder } from './accountV1ServiceBuilder.js'
import { createAccountCommandBuilder } from './command/createAccount/createAccountCommandBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./accountServiceBuilder.ts file

type CommandDefinition = Parameters<typeof accountV1ServiceBuilder.addCommandDefinition>[number]
type SubscriptionDefinition = Parameters<typeof accountV1ServiceBuilder.addSubscriptionDefinition>[number]

const commandDefinitions: CommandDefinition[] = [createAccountCommandBuilder.getDefinition()]

const subscriptionDefinitions: SubscriptionDefinition[] = []

export const accountV1Service = accountV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
