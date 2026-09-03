import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { supportV1Service } from './supportV1Service.js'

describe('evaluated support service', () => {
	it('mounts the same portable agent evaluated by the release gate', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { category: 'card', urgency: 'normal', reason: 'The customer asks about a replacement card.' },
			usage: { inputTokens: 8, outputTokens: 5, totalTokens: 13 },
			finishReason: 'stop',
		})
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			ai: { models: { primary: { provider, model: 'fake-classifier' } } },
		})
		await service.start()

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-alex',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'classifySupportMessage' },
						payload: {
							payload: { messageId: 'message-runtime', text: 'How do I replace my expiring card?' },
							parameter: {},
						},
					}),
				),
			).resolves.toEqual({
				category: 'card',
				urgency: 'normal',
				reason: 'The customer asks about a replacement card.',
			})
			provider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})
})
