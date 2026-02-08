import { pingCommandBuilder } from './command/ping/pingCommandBuilder.js'
import { emailV1ServiceBuilder } from './emailV1ServiceBuilder.js'
import { sendWelcomeEmailSubscriptionBuilder } from './subscription/sendWelcomeEmail/sendWelcomeEmailSubscriptionBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./emailServiceBuilder.ts file

type CommandDefinition = Parameters<typeof emailV1ServiceBuilder.addCommandDefinition>[number]
type SubscriptionDefinition = Parameters<typeof emailV1ServiceBuilder.addSubscriptionDefinition>[number]

const commandDefinitions: CommandDefinition[] = [pingCommandBuilder.getDefinition()]

const subscriptionDefinitions: SubscriptionDefinition[] = [sendWelcomeEmailSubscriptionBuilder.getDefinition()]

export const emailV1Service = emailV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
