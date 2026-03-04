import { lookupFaqCommandBuilder } from './command/lookupFaq/lookupFaqCommandBuilder.js'
import { requestFollowUpCommandBuilder } from './command/requestFollowUp/requestFollowUpCommandBuilder.js'
import { runSupportAgentCommandBuilder } from './command/runSupportAgent/runSupportAgentCommandBuilder.js'
import { processFollowUpSubscriptionBuilder } from './subscription/processFollowUp/processFollowUpSubscriptionBuilder.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

type CommandDefinition = Parameters<typeof supportV1ServiceBuilder.addCommandDefinition>[number]
type SubscriptionDefinition = Parameters<typeof supportV1ServiceBuilder.addSubscriptionDefinition>[number]

const commandDefinitions: CommandDefinition[] = [
	lookupFaqCommandBuilder.getDefinition(),
	runSupportAgentCommandBuilder.getDefinition(),
	requestFollowUpCommandBuilder.getDefinition(),
]

const subscriptionDefinitions: SubscriptionDefinition[] = [processFollowUpSubscriptionBuilder.getDefinition()]

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
