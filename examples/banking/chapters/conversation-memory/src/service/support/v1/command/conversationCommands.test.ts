import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { clearConversationHistoryCommandBuilder } from './clearConversationHistory/clearConversationHistoryCommandBuilder.js'
import { continueSupportConversationCommandBuilder } from './continueSupportConversation/continueSupportConversationCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('support conversation commands', () => {
	it('derives the agent session from trusted caller identity', async () => {
		const payload = { conversationId: 'case-1', question: 'What did we discuss?' }
		const policy = { canAccess: sandbox.stub().resolves(true) }
		const { context, stubs } = createCommandContextMock(continueSupportConversationCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportConversationPolicy: policy },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		;(stubs.agent as any).Support['1'].answer_support_question.run.resolves({
			status: 'completed',
			runId: 'run-1',
			output: { answer: 'We discussed a pending transfer.' },
		})

		await expect(
			continueSupportConversationCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual({ answer: 'We discussed a pending transfer.' })
		expect(
			(stubs.agent as any).Support['1'].answer_support_question.run.calledOnceWith(payload, {
				sessionId: 'support:tenant-example:principal-alex:case-1',
			}),
		).toBe(true)
		expect(
			policy.canAccess.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				conversationId: 'case-1',
				action: 'continue',
			}),
		).toBe(true)
	})

	it('clears only the identity-scoped transcript', async () => {
		const history = { list: sandbox.stub(), clear: sandbox.stub().resolves() }
		const policy = { canAccess: sandbox.stub().resolves(true) }
		const payload = { conversationId: 'case-2' }
		const { context } = createCommandContextMock(clearConversationHistoryCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportConversationHistory: history, supportConversationPolicy: policy },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})

		await expect(
			clearConversationHistoryCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual({ cleared: true })
		expect(history.clear.calledOnceWith('support:tenant-example:principal-alex:case-2')).toBe(true)
		expect(
			policy.canAccess.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				conversationId: 'case-2',
				action: 'clear',
			}),
		).toBe(true)
	})
})
