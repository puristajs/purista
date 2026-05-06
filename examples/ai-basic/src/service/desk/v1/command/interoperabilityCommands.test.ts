import {
	type Command,
	DefaultEventBridge,
	DefaultQueueBridge,
	EBMessageType,
	getNewEBMessageId,
	getNewTraceId,
	initLogger,
} from '@purista/core'
import { describe, expect, it } from 'vitest'
import { deterministicModelProvider } from '../../../../test/deterministicModelProvider.js'
import { resetExampleConversationStore } from '../exampleConversationStore.js'
import { deskV1Service } from '../index.js'

const waitForRegistration = async () => {
	await new Promise(resolve => setTimeout(resolve, 25))
}

const createCommandMessage = (instanceId: string, target: string, payload: Record<string, unknown>): Command => ({
	id: getNewEBMessageId(),
	timestamp: Date.now(),
	traceId: getNewTraceId(),
	correlationId: getNewEBMessageId(),
	messageType: EBMessageType.Command,
	contentType: 'application/json',
	contentEncoding: 'utf-8',
	sender: {
		serviceName: 'testClient',
		serviceVersion: '1',
		serviceTarget: 'integration',
		instanceId,
	},
	receiver: {
		serviceName: 'desk',
		serviceVersion: '1',
		serviceTarget: target,
	},
	payload: {
		payload,
		parameter: {},
	},
})

describe('desk interoperability commands', () => {
	it('returns MCP tools', async () => {
		const logger = initLogger('error')
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()
		const queueBridge = new DefaultQueueBridge()
		const conversationStore = resetExampleConversationStore()

		const deskService = await deskV1Service.getInstance(eventBridge, {
			logger,
			queueBridge,
			ai: {
				conversationStore,
				model: {
					'openai:gpt-4o-mini': deterministicModelProvider,
				},
			},
		})

		await deskService.start()
		await waitForRegistration()

		try {
			const mcpTools = await eventBridge.invoke(createCommandMessage(eventBridge.instanceId, 'getMcpTools', {}))
			expect(mcpTools).toEqual(
				expect.objectContaining({
					tools: expect.arrayContaining([
						expect.objectContaining({ name: 'researchAgent' }),
						expect.objectContaining({ name: 'desk.1.lookupFaq' }),
					]),
				}),
			)
		} finally {
			await deskService.destroy()
			await queueBridge.destroy()
			await eventBridge.destroy()
		}
	})
})
