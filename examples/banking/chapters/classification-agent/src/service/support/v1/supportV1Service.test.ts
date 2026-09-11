import { DefaultEventBridge, getCommandMessageMock, initLogger, ServiceBuilder } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { classifySupportMessageAgent } from './harness/agent/classifySupportMessage/classifySupportMessageAgent.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarness.js'
import type { SupportClassificationPolicy } from './SupportResources.js'
import { supportV1Service } from './supportV1Service.js'

const directCallerBuilder = new ServiceBuilder({
	serviceName: 'Support',
	serviceVersion: '1',
	serviceDescription: 'Calls the mounted classifier in integration tests',
}).defineResource<'supportClassificationPolicy', SupportClassificationPolicy>()
const callClassifierCommandBuilder = directCallerBuilder
	.getCommandBuilder('callClassifier', 'Call the mounted classifier directly')
	.addPayloadSchema(classifySupportMessageAgent.contract.input)
	.addOutputSchema(classifySupportMessageAgent.contract.output)
	.canInvokeAgent('Support', '1', classifySupportMessageAgent.contract)
	.setCommandFunction(async function ({ agent }, payload) {
		const result = await agent.Support['1'][classifySupportMessageAgent.contract.id].run(payload, {
			sessionId: `direct:${payload.messageId}`,
		})
		if (result.outcome.status !== 'completed') throw new Error('The classifier was interrupted unexpectedly.')
		return result.outcome.output
	})
const directCallerService = directCallerBuilder
	.addCommandDefinition(callClassifierCommandBuilder.getDefinition())
	.mountHarness(supportHarness, supportHarnessPolicy)

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
			ai: { models: { classification: { provider, model: 'fake-classifier' } } },
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
						serviceTarget: 'runClassifySupportMessage',
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
		const service = await directCallerService.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: { supportClassificationPolicy: { canClassify: vi.fn(async () => false) } },
			ai: { models: { classification: { provider, model: 'fake-classifier' } } },
		})
		await service.start()

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-other',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'callClassifier' },
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
