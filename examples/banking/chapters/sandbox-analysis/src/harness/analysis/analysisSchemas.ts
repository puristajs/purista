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
