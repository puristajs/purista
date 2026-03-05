import { getConversationCommandBuilder } from './command/getConversation/getConversationCommandBuilder.js'
import { lookupFaqCommandBuilder } from './command/lookupFaq/lookupFaqCommandBuilder.js'
import { requestFollowUpCommandBuilder } from './command/requestFollowUp/requestFollowUpCommandBuilder.js'
import { runSupportAgentCommandBuilder } from './command/runSupportAgent/runSupportAgentCommandBuilder.js'
import { runSupportAgentStreamBuilder } from './stream/runSupportAgentStream/runSupportAgentStreamBuilder.js'
import { processFollowUpSubscriptionBuilder } from './subscription/processFollowUp/processFollowUpSubscriptionBuilder.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

type CommandDefinition = Parameters<typeof supportV1ServiceBuilder.addCommandDefinition>[number]
type StreamDefinition = Parameters<typeof supportV1ServiceBuilder.addStreamDefinition>[number]
type SubscriptionDefinition = Parameters<typeof supportV1ServiceBuilder.addSubscriptionDefinition>[number]

const commandDefinitions: CommandDefinition[] = [
	getConversationCommandBuilder.getDefinition(),
	lookupFaqCommandBuilder.getDefinition(),
	runSupportAgentCommandBuilder.getDefinition(),
	requestFollowUpCommandBuilder.getDefinition(),
]

const subscriptionDefinitions: SubscriptionDefinition[] = [processFollowUpSubscriptionBuilder.getDefinition()]
const streamDefinitions: StreamDefinition[] = [runSupportAgentStreamBuilder.getDefinition()]

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addStreamDefinition(...streamDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
