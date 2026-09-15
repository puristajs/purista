import { z } from 'zod'

export const createTransactionSchema = z.strictObject({
	amountCents: z.number().int().positive(),
	direction: z.enum(['credit', 'debit']),
	counterparty: z.string().trim().min(2).max(80),
	reference: z.string().trim().min(1).max(120).optional(),
})

export const transactionSchema = createTransactionSchema.extend({
	transactionId: z.uuid(),
	recordedAt: z.iso.datetime(),
})

export type CreateTransaction = z.input<typeof createTransactionSchema>
export type Transaction = z.output<typeof transactionSchema>
