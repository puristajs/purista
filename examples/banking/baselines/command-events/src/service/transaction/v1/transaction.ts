import { z } from 'zod'

export const newTransactionSchema = z.strictObject({
	amountCents: z.number().int().positive(),
	direction: z.enum(['credit', 'debit']),
	counterparty: z.string().trim().min(2).max(80),
})

export const createTransactionSchema = newTransactionSchema.extend({
	accountId: z.string().trim().min(1),
	tenantId: z.string().trim().min(1),
})

export const transactionSchema = createTransactionSchema.extend({
	transactionId: z.uuid(),
	recordedAt: z.iso.datetime(),
})

export type CreateTransaction = z.input<typeof createTransactionSchema>
export type Transaction = z.output<typeof transactionSchema>
