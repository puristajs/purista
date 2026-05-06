import { deskV1ServiceBuilder } from '../../deskV1ServiceBuilder.js'
import { getExampleConversationStore } from '../../exampleConversationStore.js'
import { getConversationHistoryInputSchema, getConversationHistoryOutputSchema } from './schema.js'

const scenarioToAgent = {
	chat: 'deskChatAgent',
	research: 'researchAgent',
	planner: 'deliveryPlannerAgent',
	structured: 'architectureReviewAgent',
	reflection: 'reflectionAgent',
} as const

export const getConversationHistoryCommandBuilder = deskV1ServiceBuilder
	.getCommandBuilder(
		'getConversationHistory',
		'Loads persisted conversation history for a previously used desk session',
	)
	.addPayloadSchema(getConversationHistoryInputSchema)
	.addOutputSchema(getConversationHistoryOutputSchema)
	.exposeAsHttpEndpoint('POST', 'desk/history/load')
	.makeEndpointPublic()
	.setCommandFunction(async function (_context, payload) {
		const record = await getExampleConversationStore().load(payload.sessionId, {
			agentName: scenarioToAgent[payload.scenario],
			serviceVersion: '1',
		})
		const rawConversation = record?.data?.conversation ?? record?.data?.history
		const messages = Array.isArray(rawConversation)
			? (rawConversation as Array<{
					id: string
					role: 'system' | 'developer' | 'user' | 'assistant' | 'tool' | 'tool_result'
					content: string
					createdAt: number
					toolName?: string
					toolCallId?: string
					metadata?: Record<string, unknown>
				}>)
			: typeof rawConversation === 'object' &&
					rawConversation !== null &&
					'messages' in rawConversation &&
					Array.isArray((rawConversation as { messages?: unknown[] }).messages)
				? (
						rawConversation as {
							messages: Array<{
								id: string
								role: 'system' | 'developer' | 'user' | 'assistant' | 'tool' | 'tool_result'
								content: string
								createdAt: number
								toolName?: string
								toolCallId?: string
								metadata?: Record<string, unknown>
							}>
						}
					).messages
				: []

		return {
			found: record !== undefined,
			messages,
		}
	})
