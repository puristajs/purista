import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { inMemoryHarnessStorage } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { HarnessConversationHistory } from '../../../resources/HarnessConversationHistory.js'
import { supportV1Service } from './supportV1Service.js'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

describe('support conversation service', () => {
	it('authorizes the command and mounted agent before continuing a conversation', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { answer: 'A transfer can remain pending for two business days.' },
			usage,
			finishReason: 'stop',
		})
		const storage = inMemoryHarnessStorage()
		const policy = { canAccess: vi.fn(async () => true) }
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: {
				supportConversationHistory: new HarnessConversationHistory(storage),
				supportConversationPolicy: policy,
			},
			ai: { models: { primary: { provider, model: 'fake-support' } }, storage },
		})
		await service.start()

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-alex',
						receiver: {
							serviceName: 'Support',
							serviceVersion: '1',
							serviceTarget: 'continueSupportConversation',
						},
						payload: {
							payload: { conversationId: 'case-1', question: 'How long can it stay pending?' },
							parameter: {},
						},
					}),
				),
			).resolves.toEqual({ answer: 'A transfer can remain pending for two business days.' })
			expect(policy.canAccess).toHaveBeenCalledTimes(2)
			expect(policy.canAccess).toHaveBeenCalledWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				conversationId: 'case-1',
				action: 'continue',
			})
			provider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})

	it('denies the directly addressed agent before model work', async () => {
		const provider = new FakeModelProvider({ strict: true })
		const storage = inMemoryHarnessStorage()
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: {
				supportConversationHistory: new HarnessConversationHistory(storage),
				supportConversationPolicy: { canAccess: vi.fn(async () => false) },
			},
			ai: { models: { primary: { provider, model: 'fake-support' } }, storage },
		})
		await service.start()

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-other',
						receiver: {
							serviceName: 'Support',
							serviceVersion: '1',
							serviceTarget: 'answer_support_question',
						},
						payload: {
							payload: { conversationId: 'case-1', question: 'What did we discuss?' },
							parameter: {},
						},
					}),
				),
			).rejects.toMatchObject({ errorCode: 403 })
			provider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})
})
