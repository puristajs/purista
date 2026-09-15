import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { FakeModelProvider, objectReply } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

function providers() {
	const riskProvider = new FakeModelProvider({ strict: true })
	const responseProvider = new FakeModelProvider({ strict: true })
	return { riskProvider, responseProvider }
}

async function startService(policy: {
	canAnalyze: (input: { tenantId: string; principalId: string; caseId: string }) => Promise<boolean>
}) {
	const { riskProvider, responseProvider } = providers()
	const eventBridge = new DefaultEventBridge()
	await eventBridge.start()
	const service = await supportV1Service.getInstance(eventBridge, {
		logger: initLogger('fatal'),
		resources: { supportCasePolicy: policy },
		ai: {
			models: {
				riskAssessment: { provider: riskProvider, model: 'risk-fake' },
				responsePlanning: { provider: responseProvider, model: 'response-fake' },
			},
		},
	})
	await service.start()
	return { eventBridge, service, riskProvider, responseProvider }
}

describe('parallel specialist workflow over PURISTA', () => {
	it('runs both specialists and preserves trusted identity through both guards', async () => {
		const policy = { canAnalyze: vi.fn(async () => true) }
		const application = await startService(policy)
		application.riskProvider.enqueueObject(
			objectReply(
				{ level: 'high', evidence: ['The customer reports a missing card.'] },
				{ usage, finishReason: 'stop' },
			),
		)
		application.responseProvider.enqueueObject(
			objectReply(
				{ customerReply: 'We can help secure the card after verification.', nextAction: 'freeze_card' },
				{ usage, finishReason: 'stop' },
			),
		)

		try {
			await expect(
				application.eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-alex',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'runAnalyzeSupportCase' },
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
			expect(policy.canAnalyze).toHaveBeenCalledTimes(2)
			expect(policy.canAnalyze).toHaveBeenCalledWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				caseId: 'case-1',
			})
			application.riskProvider.assertExhausted()
			application.responseProvider.assertExhausted()
		} finally {
			await application.service.destroy()
			await application.eventBridge.destroy()
		}
	})

	it('blocks the mounted workflow before either model runs', async () => {
		const policy = {
			canAnalyze: vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false),
		}
		const application = await startService(policy)

		try {
			await expect(
				application.eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-alex',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'runAnalyzeSupportCase' },
						payload: { payload: { caseId: 'case-denied', message: 'Help' }, parameter: {} },
					}),
				),
			).rejects.toMatchObject({ errorCode: 403 })
			expect(policy.canAnalyze).toHaveBeenCalledTimes(2)
			expect(application.riskProvider.requests).toHaveLength(0)
			expect(application.responseProvider.requests).toHaveLength(0)
		} finally {
			await application.service.destroy()
			await application.eventBridge.destroy()
		}
	})

	it('blocks the wrapper command before either model runs', async () => {
		const policy = { canAnalyze: vi.fn(async () => false) }
		const application = await startService(policy)

		try {
			await expect(
				application.eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-alex',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'runAnalyzeSupportCase' },
						payload: { payload: { caseId: 'case-private', message: 'Help' }, parameter: {} },
					}),
				),
			).rejects.toMatchObject({ errorCode: 403 })
			expect(policy.canAnalyze).toHaveBeenCalledTimes(1)
			expect(application.riskProvider.requests).toHaveLength(0)
			expect(application.responseProvider.requests).toHaveLength(0)
		} finally {
			await application.service.destroy()
			await application.eventBridge.destroy()
		}
	})
})
