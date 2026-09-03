import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

describe('parallel specialist workflow over PURISTA', () => {
	it('runs both specialists, merges typed outputs, and keeps caller identity in the business guard', async () => {
		const riskProvider = new FakeModelProvider({ strict: true })
		const responseProvider = new FakeModelProvider({ strict: true })
		riskProvider.enqueueObject({
			object: { level: 'high', evidence: ['The customer reports a missing card.'] },
			usage,
			finishReason: 'stop',
		})
		responseProvider.enqueueObject({
			object: { customerReply: 'We can help secure the card after verification.', nextAction: 'freeze_card' },
			usage,
			finishReason: 'stop',
		})
		const policy = { canAnalyze: vi.fn(async () => true) }
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: { supportCasePolicy: policy },
			ai: {
				models: {
					risk_model: { provider: riskProvider, model: 'risk-fake' },
					response_model: { provider: responseProvider, model: 'response-fake' },
				},
			},
		})
		await service.start()

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-alex',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'analyzeSupportCase' },
						payload: {
							payload: { caseId: 'case-1', message: 'My card is missing.' },
							parameter: {},
						},
					}),
				),
			).resolves.toEqual({
				caseId: 'case-1',
				risk: { level: 'high', evidence: ['The customer reports a missing card.'] },
				response: { customerReply: 'We can help secure the card after verification.', nextAction: 'freeze_card' },
			})
			expect(policy.canAnalyze).toHaveBeenCalledWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				caseId: 'case-1',
			})
			expect(riskProvider.requests).toHaveLength(1)
			expect(responseProvider.requests).toHaveLength(1)
			riskProvider.assertExhausted()
			responseProvider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})

	it('does not start either specialist when the business guard denies the case', async () => {
		const riskProvider = new FakeModelProvider({ strict: true })
		const responseProvider = new FakeModelProvider({ strict: true })
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			resources: { supportCasePolicy: { canAnalyze: vi.fn(async () => false) } },
			ai: {
				models: {
					risk_model: { provider: riskProvider, model: 'risk-fake' },
					response_model: { provider: responseProvider, model: 'response-fake' },
				},
			},
		})
		await service.start()

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-alex',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'analyze_support_case' },
						payload: { payload: { caseId: 'case-denied', message: 'Help' }, parameter: {} },
					}),
				),
			).rejects.toMatchObject({ errorCode: 403 })
			expect(riskProvider.requests).toHaveLength(0)
			expect(responseProvider.requests).toHaveLength(0)
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})
})
