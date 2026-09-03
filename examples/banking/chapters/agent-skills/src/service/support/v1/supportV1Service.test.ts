import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { supportV1Service } from './supportV1Service.js'

const usage = { inputTokens: 8, outputTokens: 9, totalTokens: 17 }

describe('Skill-enabled support service', () => {
	it('authorizes the command and mounted agent before reading the Skill', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: {},
			toolCalls: [{ id: 'read-skill', name: 'read', arguments: { path: '/skills/support-methods/SKILL.md' } }],
			usage,
			finishReason: 'tool_calls',
		})
		provider.enqueueObject({
			object: { answer: 'Up to two business days.', method: 'pending_transfer' },
			usage,
			finishReason: 'stop',
		})
		const policy = { canAnswer: vi.fn(async () => true) }
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: { supportProcedurePolicy: policy },
			ai: { models: { primary: { provider, model: 'fake-support' } } },
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
							serviceTarget: 'answerProcedureQuestion',
						},
						payload: {
							payload: { caseId: 'case-104', question: 'How long can a transfer stay pending?' },
							parameter: {},
						},
					}),
				),
			).resolves.toEqual({ answer: 'Up to two business days.', method: 'pending_transfer' })
			expect(policy.canAnswer).toHaveBeenCalledTimes(2)
			provider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})

	it('denies a directly addressed agent before model work', async () => {
		const provider = new FakeModelProvider({ strict: true })
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: { supportProcedurePolicy: { canAnswer: vi.fn(async () => false) } },
			ai: { models: { primary: { provider, model: 'fake-support' } } },
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
							serviceTarget: 'answer_procedure_question',
						},
						payload: {
							payload: { caseId: 'case-104', question: 'Read the procedure.' },
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
