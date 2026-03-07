import { loadConversationSnapshot } from '../../../../../utils/conversationSnapshotStore.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import { getConversationInputSchema, getConversationOutputSchema } from './schema.js'

export const getConversationCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('getConversation', 'Loads persisted agent conversation snapshot by session id')
	.addPayloadSchema(getConversationInputSchema)
	.addOutputSchema(getConversationOutputSchema)
	.exposeAsHttpEndpoint('POST', 'support/conversation')
	.setCommandFunction(async function (_context, payload) {
		const snapshot = loadConversationSnapshot(payload.sessionId)
		return {
			sessionId: payload.sessionId,
			conversationId: snapshot?.conversationId,
			updatedAt: snapshot?.updatedAt,
			envelopes: snapshot?.envelopes ?? [],
		}
	})
