import { conversationSessionId } from '../../conversationSessionId.js'
import { requireSupportConversationAccess } from '../../requireSupportConversationAccess.js'
import { conversationHistoryRequestSchema, conversationHistorySchema } from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const getConversationHistoryCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('getConversationHistory', "Export the current caller's support conversation history")
	.addPayloadSchema(conversationHistoryRequestSchema)
	.addOutputSchema(conversationHistorySchema)
	.setBeforeGuardHooks({
		conversationAccess: async function (context, payload) {
			await requireSupportConversationAccess(
				context.resources.supportConversationPolicy,
				context.message,
				payload.conversationId,
				'read',
			)
		},
	})
	.setCommandFunction(async function (context, payload) {
		const sessionId = conversationSessionId(context.message, payload.conversationId)
		return { messages: await context.resources.supportConversationHistory.list(sessionId) }
	})
