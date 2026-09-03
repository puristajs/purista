import { z } from 'zod'

export const analysisV1SummarizeTransactionsInputParameterSchema = z.object({
	accountId: z.string().trim().min(1),
})
export const analysisV1SummarizeTransactionsInputPayloadSchema = z.undefined()
export const analysisV1SummarizeTransactionsFinalPayloadSchema = z.strictObject({
	accountId: z.string().trim().min(1),
	transactionCount: z.number().int().nonnegative(),
	creditCents: z.number().int().nonnegative(),
	debitCents: z.number().int().nonnegative(),
	netCents: z.number().int(),
})
export const analysisV1SummarizeTransactionsChunkPayloadSchema = z.discriminatedUnion('stage', [
	z.strictObject({
		stage: z.enum(['loading', 'summarizing']),
		completed: z.number().int().nonnegative(),
		total: z.number().int().nonnegative(),
	}),
	z.strictObject({
		stage: z.literal('complete'),
		completed: z.number().int().nonnegative(),
		total: z.number().int().nonnegative(),
		summary: analysisV1SummarizeTransactionsFinalPayloadSchema,
	}),
])
