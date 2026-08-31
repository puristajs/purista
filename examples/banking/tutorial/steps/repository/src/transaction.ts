import { z } from 'zod'

/** Synthetic account identifiers used by the learning application. */
export const accountIdSchema = z.enum(['account-a', 'account-c'])

/** A record of a transaction that has already happened; it does not move money. */
export const transactionInputSchema = z.object({
	accountId: accountIdSchema,
	sourceTransactionId: z.string().min(1).max(80),
	bookedAt: z.iso.datetime(),
	amountMinor: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
	currency: z.literal('EUR'),
	direction: z.enum(['debit', 'credit']),
})

export const recordedTransactionSchema = transactionInputSchema.extend({
	transactionId: z.string().uuid(),
})

export type TransactionInput = z.infer<typeof transactionInputSchema>
export type RecordedTransaction = z.infer<typeof recordedTransactionSchema>
