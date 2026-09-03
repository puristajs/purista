import { z } from 'zod'

export const generatedStatementSchema = z.strictObject({
	accountId: z.string().trim().min(1),
	transactionId: z.uuid(),
	amountCents: z.number().int().positive(),
	direction: z.enum(['credit', 'debit']),
	counterparty: z.string().trim().min(2).max(80),
	generatedAt: z.iso.datetime(),
})

export type GeneratedStatement = z.output<typeof generatedStatementSchema>
