import { confirmEmailCommandBuilder } from './command/confirmEmail/confirmEmailCommandBuilder.js'
import { sendVerificationEmailCommandBuilder } from './command/sendVerificationEmail/sendVerificationEmailCommandBuilder.js'
import { emailV1ServiceBuilder } from './emailV1ServiceBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./emailServiceBuilder.ts file

type CommandDefinition = Parameters<typeof emailV1ServiceBuilder.addCommandDefinition>[number]
type SubscriptionDefinition = Parameters<typeof emailV1ServiceBuilder.addSubscriptionDefinition>[number]

const commandDefinitions: CommandDefinition[] = [
	confirmEmailCommandBuilder.getDefinition(),
	sendVerificationEmailCommandBuilder.getDefinition(),
]

const subscriptionDefinitions: SubscriptionDefinition[] = []

export const emailV1Service = emailV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
