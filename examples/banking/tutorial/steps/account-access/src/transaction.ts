import { z } from 'zod'

export const accountIdSchema = z.enum(['account-a', 'account-c'])

export const transactionInputSchema = z.object({
	accountId: accountIdSchema,
	sourceTransactionId: z.string().min(1).max(80),
	bookedAt: z.iso.datetime(),
	amountMinor: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
	currency: z.literal('EUR'),
	direction: z.enum(['debit', 'credit']),
})

/** The server supplies tenantId; callers cannot select it in transaction input. */
export const recordedTransactionSchema = transactionInputSchema.extend({
	tenantId: z.string().min(1),
	transactionId: z.string().uuid(),
})

export const accountStatementSchema = z.object({
	tenantId: z.string().min(1),
	accountId: accountIdSchema,
	transactions: z.array(recordedTransactionSchema),
})

export type TransactionInput = z.infer<typeof transactionInputSchema>
export type RecordedTransaction = z.infer<typeof recordedTransactionSchema>
export type AccountStatement = z.infer<typeof accountStatementSchema>
