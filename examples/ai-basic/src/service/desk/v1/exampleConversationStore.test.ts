import { describe, expect, it } from 'vitest'
import {
	createInternalConversationSessionId,
	getExampleConversationStore,
	resetExampleConversationStore,
} from './exampleConversationStore.js'

describe('ExampleConversationStore', () => {
	it('omits internal delegate sessions from recent history', async () => {
		const store = resetExampleConversationStore()
		const now = Date.now()

		await store.save(
			{
				conversationId: 'session-1',
				updatedAt: now,
				data: {
					conversation: {
						messages: [
							{
								id: 'user-1',
								role: 'user',
								content: 'Top-level planner request',
								createdAt: now,
							},
						],
					},
				},
			},
			{ agentName: 'deliveryPlannerAgent', serviceVersion: '1' },
		)

		await store.save(
			{
				conversationId: createInternalConversationSessionId('session-1', 'planner:research:task-1'),
				updatedAt: now + 1,
				data: {
					conversation: {
						messages: [
							{
								id: 'user-2',
								role: 'user',
								content: 'Delegate task request',
								createdAt: now + 1,
							},
						],
					},
				},
			},
			{ agentName: 'researchAgent', serviceVersion: '1' },
		)

		await new Promise(resolve => setTimeout(resolve, 2))

		await store.save(
			{
				conversationId: 'session-1',
				updatedAt: now + 2,
				data: {
					conversation: {
						messages: [
							{
								id: 'user-3',
								role: 'user',
								content: 'Updated top-level planner request',
								createdAt: now + 2,
							},
						],
					},
				},
			},
			{ agentName: 'deliveryPlannerAgent', serviceVersion: '1' },
		)

		const recent = await getExampleConversationStore().listRecent()
		expect(recent).toHaveLength(1)
		expect(recent[0]).toMatchObject({
			sessionId: 'session-1',
			scenario: 'planner',
			firstMessage: 'Updated top-level planner request',
		})
	})
})
