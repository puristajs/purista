import { architectureReviewAgentBuilder } from './agent/architectureReviewAgent/architectureReviewAgentBuilder.js'
import { deliveryPlannerAgentBuilder } from './agent/deliveryPlannerAgent/deliveryPlannerAgentBuilder.js'
import { deskChatAgentBuilder } from './agent/deskChatAgent/deskChatAgentBuilder.js'
import { reflectionAgentBuilder } from './agent/reflectionAgent/reflectionAgentBuilder.js'
import { researchAgentBuilder } from './agent/researchAgent/researchAgentBuilder.js'
import { calculateCommandBuilder } from './command/calculate/calculateCommandBuilder.js'
import { fetchWebsiteCommandBuilder } from './command/fetchWebsite/fetchWebsiteCommandBuilder.js'
import { getConversationHistoryCommandBuilder } from './command/getConversationHistory/getConversationHistoryCommandBuilder.js'
import { getMcpToolsCommandBuilder } from './command/getMcpTools/getMcpToolsCommandBuilder.js'
import { getRecentConversationHistoryCommandBuilder } from './command/getRecentConversationHistory/getRecentConversationHistoryCommandBuilder.js'
import { lookupFaqCommandBuilder } from './command/lookupFaq/lookupFaqCommandBuilder.js'
import { runDeskA2aCommandBuilder } from './command/runDeskA2a/runDeskA2aCommandBuilder.js'
import { runDeskChatCommandBuilder } from './command/runDeskChat/runDeskChatCommandBuilder.js'
import { runDeskMcpCommandBuilder } from './command/runDeskMcp/runDeskMcpCommandBuilder.js'
import { deskV1ServiceBuilder } from './deskV1ServiceBuilder.js'

type CommandDefinition = Parameters<typeof deskV1ServiceBuilder.addCommandDefinition>[number]

const commandDefinitions: CommandDefinition[] = [
	calculateCommandBuilder.getDefinition(),
	fetchWebsiteCommandBuilder.getDefinition(),
	getConversationHistoryCommandBuilder.getDefinition(),
	getRecentConversationHistoryCommandBuilder.getDefinition(),
	getMcpToolsCommandBuilder.getDefinition(),
	lookupFaqCommandBuilder.getDefinition(),
	runDeskA2aCommandBuilder.getDefinition(),
	runDeskChatCommandBuilder.getDefinition(),
	runDeskMcpCommandBuilder.getDefinition(),
]

const deskChatAgentDefinition = deskChatAgentBuilder.getDefinition()
const researchAgentDefinition = researchAgentBuilder.getDefinition()
const architectureReviewAgentDefinition = architectureReviewAgentBuilder.getDefinition()
const deliveryPlannerAgentDefinition = deliveryPlannerAgentBuilder.getDefinition()
const reflectionAgentDefinition = reflectionAgentBuilder.getDefinition()

export const deskV1Service = deskV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addAgentDefinition(deskChatAgentDefinition)
	.addAgentDefinition(researchAgentDefinition)
	.addAgentDefinition(architectureReviewAgentDefinition)
	.addAgentDefinition(deliveryPlannerAgentDefinition)
	.addAgentDefinition(reflectionAgentDefinition)
