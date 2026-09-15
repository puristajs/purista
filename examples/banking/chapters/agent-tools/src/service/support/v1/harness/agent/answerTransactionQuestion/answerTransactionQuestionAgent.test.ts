import { describe, expect, it } from 'vitest'
import { lookupTransactionTool } from '../../tool/lookupTransaction/lookupTransactionTool.js'
import { answerTransactionQuestionAgent } from './answerTransactionQuestionAgent.js'

describe('answerTransactionQuestionAgent', () => {
	it('keeps the service-owned transaction tool on the agent definition', () => {
		expect(answerTransactionQuestionAgent.id).toBe('answerTransactionQuestion')
		expect(answerTransactionQuestionAgent.tools).toEqual([lookupTransactionTool])
		expect(Object.isFrozen(answerTransactionQuestionAgent)).toBe(true)
	})

	it('maps every request field into the model prompt', () => {
		expect(
			answerTransactionQuestionAgent.prompt({
				questionId: 'question-1',
				question: 'What is this payment?',
				accountId: 'account-1',
				transactionId: 'transaction-1',
			}),
		).toEqual([
			{
				role: 'user',
				content: [
					'Question question-1: What is this payment?',
					'Account: account-1',
					'Transaction: transaction-1',
				].join('\n'),
			},
		])
	})
})
