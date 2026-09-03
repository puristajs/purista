import { defineHarness } from '@purista/harness'
import { z } from 'zod'

export const transactionRowSchema = z.strictObject({
	id: z.string().trim().min(1).max(80),
	amount: z.number().finite(),
	country: z.string().length(2),
})

export const analyzeTransactionsInputSchema = z.strictObject({
	analysisId: z.string().trim().min(1).max(80),
	transactions: z.array(transactionRowSchema).min(1).max(500),
})

export const analyzeTransactionsOutputSchema = z.strictObject({
	analysisId: z.string(),
	flaggedTransactionIds: z.array(z.string()).max(500),
	summary: z.string().trim().min(1).max(500),
})

export const transactionAnalysisHarness = defineHarness({ name: 'transaction-analysis' })
	.requireModel('analysis_model', { capabilities: ['object', 'tool_use'] })
	.agent('analyze_transactions', {
		model: 'analysis_model',
		input: analyzeTransactionsInputSchema,
		output: analyzeTransactionsOutputSchema,
		builtinTools: ['write', 'bash', 'read'],
		permissions: {
			write: { mode: 'allow', allow: ['/workspace/**'] },
			bash: { mode: 'allow', allow: ['python3'] },
		},
		instructions: [
			'Analyze the supplied transaction rows inside the sandbox.',
			'Write only under /workspace, run only python3, and read the produced result before answering.',
			'Return only the structured analysis. Never claim a transaction was blocked.',
		].join(' '),
		maxSteps: 6,
	})
	.define()
