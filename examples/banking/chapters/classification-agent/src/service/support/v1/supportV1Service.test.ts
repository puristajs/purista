import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { supportV1Service } from './supportV1Service.js'

describe('supportV1Service', () => {
	it('routes the command to the mounted agent through EventBridge', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: {
				category: 'card',
				urgency: 'normal',
				reason: 'The message asks about a replacement card without an immediate deadline.',
			},
			usage: { inputTokens: 10, outputTokens: 11, totalTokens: 21 },
			finishReason: 'stop',
		})
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const policy = { canClassify: vi.fn(async () => true) }
		const service = await supportV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: { supportClassificationPolicy: policy },
			ai: { models: { primary: { provider, model: 'fake-classifier' } } },
		})
		await service.start()

		try {
			const response = await eventBridge.invoke(
				getCommandMessageMock({
					tenantId: 'tenant-example',
					principalId: 'principal-alex',
					receiver: {
						serviceName: 'Support',
						serviceVersion: '1',
						serviceTarget: 'classifySupportMessage',
					},
					payload: {
						payload: { messageId: 'MSG-200', text: 'How do I replace an expiring card?' },
						parameter: {},
					},
				}),
			)

			expect(response).toEqual({
				category: 'card',
				urgency: 'normal',
				reason: 'The message asks about a replacement card without an immediate deadline.',
			})
			expect(policy.canClassify).toHaveBeenCalledTimes(2)
			expect(policy.canClassify).toHaveBeenCalledWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				messageId: 'MSG-200',
			})
			provider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})

	it('denies the published agent before the model is called', async () => {
		const provider = new FakeModelProvider({ strict: true })
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: { supportClassificationPolicy: { canClassify: vi.fn(async () => false) } },
			ai: { models: { primary: { provider, model: 'fake-classifier' } } },
		})
		await service.start()

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-other',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'classify_support_message' },
						payload: {
							payload: { messageId: 'MSG-201', text: 'Please classify this message.' },
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
