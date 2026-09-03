import { createCommandContextMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { answerProcedureQuestionCommandBuilder } from './answerProcedureQuestionCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('answerProcedureQuestionCommandBuilder', () => {
	it('invokes the Skill-enabled agent through its declared address', async () => {
		const payload = { requestId: 'request-1', question: 'How long can a transfer stay pending?' }
		const { context, stubs } = createCommandContextMock(answerProcedureQuestionCommandBuilder, {
			payload,
			parameter: {},
			sandbox,
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
				sessionId: 'support-procedure:request-1',
			}),
		).toBe(true)
	})
})
