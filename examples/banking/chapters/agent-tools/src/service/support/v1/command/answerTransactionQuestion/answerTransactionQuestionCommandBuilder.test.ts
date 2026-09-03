import { createCommandContextMock } from '@purista/core'
import { describe, expect, it } from 'vitest'
import { answerTransactionQuestionCommandBuilder } from './answerTransactionQuestionCommandBuilder.js'

describe('answerTransactionQuestion command', () => {
	it('invokes the mounted agent through its declared PURISTA address', async () => {
		const payload = {
			questionId: 'question-1',
			accountId: 'account-operating',
			transactionId: 'tx-100',
			question: 'What is the status?',
		}
		const { context, stubs } = createCommandContextMock(answerTransactionQuestionCommandBuilder, {
			payload,
			parameter: {},
		})
		const run = (stubs.agent as any).Support['1'].answer_transaction_question.run
		run.resolves({
			status: 'completed',
			runId: 'run-1',
			output: { answer: 'It is pending.', transactionIds: ['tx-100'] },
		})

		await expect(
			answerTransactionQuestionCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual({ answer: 'It is pending.', transactionIds: ['tx-100'] })
		expect(run.calledOnceWith(payload, { sessionId: 'support-question:question-1' })).toBe(true)
	})
})
