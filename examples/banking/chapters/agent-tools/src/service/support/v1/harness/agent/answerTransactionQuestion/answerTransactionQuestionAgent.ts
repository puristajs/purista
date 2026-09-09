import { defineAgent } from '@purista/harness'
import { answerTransactionQuestionInputSchema, answerTransactionQuestionOutputSchema } from '../../../schema.js'
import { lookupTransactionTool } from '../../tool/lookupTransaction/lookupTransactionTool.js'

export { answerTransactionQuestionInputSchema, answerTransactionQuestionOutputSchema }
export const answerTransactionQuestionAgent = defineAgent('answerTransactionQuestion', {
	input: answerTransactionQuestionInputSchema,
	output: answerTransactionQuestionOutputSchema,
	instructions: 'Use lookupTransaction for the requested transaction. Return a concise answer and the transaction id.',
	tools: [lookupTransactionTool],
	prompt: (input) => ({
		role: 'user',
		content: [
			`Question ${input.questionId}: ${input.question}`,
			`Account: ${input.accountId}`,
			`Transaction: ${input.transactionId}`,
		].join('\n'),
	}),
})
