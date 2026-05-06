import { deskV1ServiceBuilder } from '../../deskV1ServiceBuilder.js'
import { getExampleConversationStore } from '../../exampleConversationStore.js'
import { getRecentConversationHistoryInputSchema, getRecentConversationHistoryOutputSchema } from './schema.js'

export const getRecentConversationHistoryCommandBuilder = deskV1ServiceBuilder
	.getCommandBuilder('getRecentConversationHistory', 'Lists recent persisted desk conversations from the backend store')
	.addPayloadSchema(getRecentConversationHistoryInputSchema)
	.addOutputSchema(getRecentConversationHistoryOutputSchema)
	.exposeAsHttpEndpoint('POST', 'desk/history/recent')
	.makeEndpointPublic()
	.setCommandFunction(async function (_context, payload) {
		const items = await getExampleConversationStore().listRecent(payload?.limit ?? 30)
		return {
			items,
		}
	})
