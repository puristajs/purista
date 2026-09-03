import { type BuilderState, defineHarness, defineHarnessModule, type ModelAlias } from '@purista/harness'
import { z } from 'zod'

export const lookupTransactionInputSchema = z.strictObject({
	accountId: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/),
	transactionId: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/),
})

export const transactionSummarySchema = z.strictObject({
	transactionId: z.string(),
	accountId: z.string(),
	status: z.enum(['pending', 'booked', 'rejected']),
	amount: z.number(),
	currency: z.string().length(3),
})

export const answerTransactionQuestionInputSchema = z.strictObject({
	questionId: z.string().min(1).max(80),
	question: z.string().trim().min(1).max(2_000),
})

export const answerTransactionQuestionOutputSchema = z.strictObject({
	answer: z.string().trim().min(1).max(2_000),
	transactionIds: z.array(z.string()).max(10),
})

type PrimaryModelState = BuilderState & { models: { primary: ModelAlias } }

const supportTools = defineHarnessModule<PrimaryModelState>()('support.tools.transaction-summary', {
	version: '1.0.0',
	register(builder) {
		return builder
			.hostTool('lookup_transaction', {
				kind: 'host',
				description: 'Read one authorized transaction summary by account and transaction id.',
				input: lookupTransactionInputSchema,
				output: transactionSummarySchema,
			})
			.agent('answer_transaction_question', {
				model: 'primary',
				input: answerTransactionQuestionInputSchema,
				output: answerTransactionQuestionOutputSchema,
				tools: ['lookup_transaction'],
				instructions: [
					'Answer the support question using authorized transaction summaries when needed.',
					'Never claim that a transaction was changed.',
					'Include every transaction id used in the answer.',
				].join(' '),
			})
	},
})

export const supportHarness = defineHarness({ name: 'support-tools' })
	.requireModel('primary', { capabilities: ['object', 'tool_use'] })
	.use(supportTools)
	.define()
