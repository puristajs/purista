import { conversationSessionId } from '../../conversationSessionId.js'
import { clearedConversationHistorySchema, conversationHistoryRequestSchema } from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const clearConversationHistoryCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('clearConversationHistory', "Clear the current caller's support conversation transcript")
	.addPayloadSchema(conversationHistoryRequestSchema)
	.addOutputSchema(clearedConversationHistorySchema)
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('POST', 'support/conversations/clear')
	.setCommandFunction(async function (context, payload) {
		const sessionId = conversationSessionId(context.message, payload.conversationId)
		await context.resources.supportConversationHistory.clear(sessionId)
		return { cleared: true as const }
	})
