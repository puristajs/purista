import type { CommandDefinitionList, SubscriptionDefinitionList } from '@purista/core'

import { confirmEmailCommandBuilder } from './command/confirmEmail/confirmEmailCommandBuilder.js'
import { sendVerificationEmailCommandBuilder } from './command/sendVerificationEmail/sendVerificationEmailCommandBuilder.js'
import { emailV1ServiceBuilder } from './emailV1ServiceBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./emailServiceBuilder.ts file

const commandDefinitions: CommandDefinitionList<any> = [
	confirmEmailCommandBuilder.getDefinition(),
	sendVerificationEmailCommandBuilder.getDefinition(),
]

const subscriptionDefinitions: SubscriptionDefinitionList<any> = []

export const emailV1Service = emailV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
