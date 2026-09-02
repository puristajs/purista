import { z } from 'zod'
import { transactionSchema } from '../../transaction.js'

export const transactionV1ImportProviderTransactionInputPayloadSchema = z.object({}).strict()
export const transactionV1ImportProviderTransactionInputParameterSchema = z.object({
	accountId: z.string().trim().min(1),
	sourceId: z.string().regex(/^[a-zA-Z0-9_-]+$/).min(1).max(80),
})
export const transactionV1ImportProviderTransactionOutputPayloadSchema = transactionSchema
