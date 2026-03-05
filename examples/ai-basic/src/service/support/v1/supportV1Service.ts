import { calculateCommandBuilder } from './command/calculate/calculateCommandBuilder.js'
import { fetchWebsiteCommandBuilder } from './command/fetchWebsite/fetchWebsiteCommandBuilder.js'
import { getConversationCommandBuilder } from './command/getConversation/getConversationCommandBuilder.js'
import { getMcpToolsCommandBuilder } from './command/getMcpTools/getMcpToolsCommandBuilder.js'
import { lookupFaqCommandBuilder } from './command/lookupFaq/lookupFaqCommandBuilder.js'
import { runSupportA2aCommandBuilder } from './command/runSupportA2a/runSupportA2aCommandBuilder.js'
import { runSupportAgentCommandBuilder } from './command/runSupportAgent/runSupportAgentCommandBuilder.js'
import { runSupportMcpCommandBuilder } from './command/runSupportMcp/runSupportMcpCommandBuilder.js'
import { runSupportAgentStreamBuilder } from './stream/runSupportAgentStream/runSupportAgentStreamBuilder.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

type CommandDefinition = Parameters<typeof supportV1ServiceBuilder.addCommandDefinition>[number]
type StreamDefinition = Parameters<typeof supportV1ServiceBuilder.addStreamDefinition>[number]

const commandDefinitions: CommandDefinition[] = [
	calculateCommandBuilder.getDefinition(),
	fetchWebsiteCommandBuilder.getDefinition(),
	getMcpToolsCommandBuilder.getDefinition(),
	getConversationCommandBuilder.getDefinition(),
	lookupFaqCommandBuilder.getDefinition(),
	runSupportA2aCommandBuilder.getDefinition(),
	runSupportAgentCommandBuilder.getDefinition(),
	runSupportMcpCommandBuilder.getDefinition(),
]

const streamDefinitions: StreamDefinition[] = [runSupportAgentStreamBuilder.getDefinition()]

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addStreamDefinition(...streamDefinitions)
