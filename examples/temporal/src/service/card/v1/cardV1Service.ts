import { cardV1ServiceBuilder } from './cardV1ServiceBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./cardServiceBuilder.ts file

type CommandDefinition = Parameters<typeof cardV1ServiceBuilder.addCommandDefinition>[number]
type SubscriptionDefinition = Parameters<typeof cardV1ServiceBuilder.addSubscriptionDefinition>[number]

const commandDefinitions: CommandDefinition[] = []

const subscriptionDefinitions: SubscriptionDefinition[] = []

export const cardV1Service = cardV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
