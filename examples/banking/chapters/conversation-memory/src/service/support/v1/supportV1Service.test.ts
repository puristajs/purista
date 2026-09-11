import { DefaultEventBridge, getCommandMessageMock, initLogger, ServiceBuilder } from '@purista/core'
import { inMemoryHarnessStorage } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { HarnessConversationHistory } from '../../../resources/HarnessConversationHistory.js'
import { conversationSessionId } from './conversationSessionId.js'
import { answerSupportQuestionAgent } from './harness/agent/answerSupportQuestion/answerSupportQuestionAgent.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarness.js'
import type { SupportConversationHistory } from './SupportConversationHistory.js'
import type { SupportConversationPolicy } from './SupportConversationPolicy.js'
import { supportV1Service } from './supportV1Service.js'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

const directCallerBuilder = new ServiceBuilder({
	serviceName: 'Support',
	serviceVersion: '1',
	serviceDescription: 'Calls the conversation agent in integration tests',
})
	.defineResource<'supportConversationHistory', SupportConversationHistory>()
	.defineResource<'supportConversationPolicy', SupportConversationPolicy>()
const callSupportAgentCommandBuilder = directCallerBuilder
	.getCommandBuilder('callSupportAgent', 'Call the conversation agent directly')
	.addPayloadSchema(answerSupportQuestionAgent.contract.input)
	.addOutputSchema(answerSupportQuestionAgent.contract.output)
	.canInvokeAgent('Support', '1', answerSupportQuestionAgent.contract)
	.setCommandFunction(async function (context, payload) {
		const result = await context.agent.Support['1'][answerSupportQuestionAgent.contract.id].run(payload, {
			sessionId: conversationSessionId(context.message, payload.conversationId),
		})
		if (result.outcome.status !== 'completed') throw new Error('The support answer was interrupted unexpectedly.')
		return result.outcome.output
	})
const directCallerService = directCallerBuilder
	.addCommandDefinition(callSupportAgentCommandBuilder.getDefinition())
	.mountHarness(supportHarness, supportHarnessPolicy)

const invoke = (
	eventBridge: DefaultEventBridge,
	serviceTarget: string,
	payload: unknown,
	principalId = 'principal-alex',
) =>
	eventBridge.invoke(
		getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId,
			receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget },
			payload: { payload, parameter: {} },
		}),
	)

describe('support conversation service', () => {
	it('uses one mounted session for the agent and authorized history commands', async () => {
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
			ai: { models: { answering: { provider, model: 'fake-support' } }, storage },
		})
		await service.start()

		try {
			const payload = { conversationId: 'case-1', question: 'How long can it stay pending?' }
			await expect(invoke(eventBridge, 'continueSupportConversation', payload)).resolves.toEqual({
				answer: 'A transfer can remain pending for two business days.',
			})
			const history = await invoke(eventBridge, 'getConversationHistory', { conversationId: 'case-1' })
			expect(history).toMatchObject({ messages: [{ role: 'user' }, { role: 'assistant' }] })
			await expect(invoke(eventBridge, 'clearConversationHistory', { conversationId: 'case-1' })).resolves.toEqual({
				cleared: true,
			})
			await expect(invoke(eventBridge, 'getConversationHistory', { conversationId: 'case-1' })).resolves.toEqual({
				messages: [],
			})
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
			await storage.close()
		}
	})

	it('denies an addressed mounted agent before model work', async () => {
		const provider = new FakeModelProvider({ strict: true })
		const storage = inMemoryHarnessStorage()
		const policy = { canAccess: vi.fn(async () => false) }
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await directCallerService.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: {
				supportConversationHistory: new HarnessConversationHistory(storage),
				supportConversationPolicy: policy,
			},
			ai: { models: { answering: { provider, model: 'fake-support' } }, storage },
		})
		await service.start()

		try {
			await expect(
				invoke(
					eventBridge,
					'callSupportAgent',
					{ conversationId: 'case-1', question: 'What did we discuss?' },
					'principal-other',
				),
			).rejects.toMatchObject({ errorCode: 403 })
			expect(policy.canAccess).toHaveBeenCalledWith({
				tenantId: 'tenant-example',
				principalId: 'principal-other',
				conversationId: 'case-1',
				action: 'continue',
			})
			provider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
			await storage.close()
		}
	})
})
