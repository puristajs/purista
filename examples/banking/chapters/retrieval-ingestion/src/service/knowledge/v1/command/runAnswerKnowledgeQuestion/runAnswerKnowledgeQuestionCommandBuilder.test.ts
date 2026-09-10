import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import { answerKnowledgeQuestionAgent } from '../../harness/agent/answerKnowledgeQuestion/answerKnowledgeQuestionAgent.js'
import { runAnswerKnowledgeQuestionCommandBuilder } from './runAnswerKnowledgeQuestionCommandBuilder.js'

const payload = { collectionId: 'customer-help', question: 'How long are transfers pending?', conversationId: 'chat-1' }
const approval = {
	type: 'tool-approval' as const,
	runId: 'run-approval',
	interruptId: 'interrupt-1',
	revision: 'revision-1',
	eventId: 'event-1',
	decisions: [{ approvalId: 'approval-1', approved: true }],
}

function context(input = payload, allowed = true) {
	const policy = { canAccess: vi.fn().mockResolvedValue(allowed) }
	const test = createCommandContextMock(runAnswerKnowledgeQuestionCommandBuilder, {
		payload: input,
		parameter: {},
		resources: { knowledgeCollectionPolicy: policy },
	})
	test.context.message = getCommandMessageMock({
		tenantId: 'tenant-example',
		principalId: 'principal-alex',
		payload: { payload: input, parameter: {} },
	})
	return { ...test, policy }
}

describe('runAnswerKnowledgeQuestionCommandBuilder', () => {
	it('returns the mounted agent result with a stable tenant-scoped session', async () => {
		const first = context()
		const target = first.stubs.agent.Knowledge['1'][answerKnowledgeQuestionAgent.contract.id].run
		const result = {
			sessionId: 'knowledge-answer:runtime',
			outcome: { status: 'completed' as const, runId: 'run-1', output: 'Two days [transfer-guide#0].' },
		}
		target.resolves(result)
		await expect(
			runAnswerKnowledgeQuestionCommandBuilder.getCommandFunction().call({} as never, first.context, payload, {}),
		).resolves.toEqual(result)
		expect(first.policy.canAccess).toHaveBeenCalledWith({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			collectionId: 'customer-help',
			action: 'search',
		})
		expect(target.firstCall.args[0]).toEqual({ collectionId: payload.collectionId, question: payload.question })
		const sessionId = target.firstCall.args[1]?.sessionId
		expect(sessionId).toMatch(/^knowledge-answer:[a-f0-9]{64}$/)

		const second = context()
		const secondTarget = second.stubs.agent.Knowledge['1'][answerKnowledgeQuestionAgent.contract.id].run
		secondTarget.resolves(result)
		await runAnswerKnowledgeQuestionCommandBuilder.getCommandFunction().call({} as never, second.context, payload, {})
		expect(secondTarget.firstCall.args[1]?.sessionId).toBe(sessionId)
	})

	it('forwards a typed approval resume without changing the session', async () => {
		const resumedPayload = { ...payload, resume: approval }
		const test = context(resumedPayload)
		const target = test.stubs.agent.Knowledge['1'][answerKnowledgeQuestionAgent.contract.id].run
		target.resolves({
			sessionId: 'knowledge-answer:runtime',
			outcome: {
				status: 'interrupted',
				runId: 'run-approval',
				interrupt: {
					type: 'tool-approval',
					id: 'interrupt-2',
					revision: 'revision-2',
					requests: [
						{
							approvalId: 'approval-2',
							runId: 'run-approval',
							agentRunId: 'agent-run-1',
							agentId: 'answerKnowledgeQuestion',
							invocationId: 'invocation-1',
							step: 1,
							toolId: 'searchKnowledge',
							callId: 'search-2',
							input: { collectionId: 'customer-help' },
							demands: [],
						},
					],
				},
			},
		})
		await runAnswerKnowledgeQuestionCommandBuilder
			.getCommandFunction()
			.call({} as never, test.context, resumedPayload, {})
		expect(target.firstCall.args[1]).toMatchObject({
			sessionId: expect.stringMatching(/^knowledge-answer:[a-f0-9]{64}$/),
			resume: approval,
		})
	})

	it('denies before it invokes the mounted agent', async () => {
		const test = context(payload, false)
		const target = test.stubs.agent.Knowledge['1'][answerKnowledgeQuestionAgent.contract.id].run
		await expect(
			runAnswerKnowledgeQuestionCommandBuilder.getCommandFunction().call({} as never, test.context, payload, {}),
		).rejects.toMatchObject({ errorCode: 403 })
		expect(target.called).toBe(false)
	})
})
