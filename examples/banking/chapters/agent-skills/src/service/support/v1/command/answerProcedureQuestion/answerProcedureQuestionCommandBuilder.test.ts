import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { answerProcedureQuestionCommandBuilder } from './answerProcedureQuestionCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('answerProcedureQuestionCommandBuilder', () => {
	it('invokes the Skill-enabled agent through its declared address', async () => {
		const payload = { caseId: 'case-104', question: 'How long can a transfer stay pending?' }
		const policy = { canAnswer: sandbox.stub().resolves(true) }
		const { context, stubs } = createCommandContextMock(answerProcedureQuestionCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportProcedurePolicy: policy },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		;(stubs.agent as any).Support['1'].answer_procedure_question.run.resolves({
			status: 'completed',
			runId: 'run-1',
			output: { answer: 'Up to two business days.', method: 'pending_transfer' },
		})

		await expect(
			answerProcedureQuestionCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual({ answer: 'Up to two business days.', method: 'pending_transfer' })
		expect(
			(stubs.agent as any).Support['1'].answer_procedure_question.run.calledOnceWith(payload, {
				sessionId: 'support-procedure:tenant-example:principal-alex:case-104',
			}),
		).toBe(true)
		expect(
			policy.canAnswer.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				caseId: 'case-104',
			}),
		).toBe(true)
	})
})
