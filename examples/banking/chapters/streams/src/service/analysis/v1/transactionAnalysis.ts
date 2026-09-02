import { z } from 'zod'

export const analysisTransactionSchema = z.strictObject({
	transactionId: z.uuid(),
	amountCents: z.number().int().positive(),
	direction: z.enum(['credit', 'debit']),
	counterparty: z.string().trim().min(2).max(80),
	recordedAt: z.iso.datetime(),
})

export type AnalysisTransaction = z.output<typeof analysisTransactionSchema>

export type TransactionAnalysisScope = {
	tenantId: string
	principalId: string
	accountId: string
}
