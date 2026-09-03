import { z } from 'zod'
import { createTransactionSchema, transactionSchema } from '../../transaction.js'

export const transactionV1ImportLegacyTransactionInputPayloadSchema = createTransactionSchema
export const transactionV1ImportLegacyTransactionInputParameterSchema = z.object({
	accountId: z.string().trim().min(1),
})
export const transactionV1ImportLegacyTransactionOutputPayloadSchema = transactionSchema

export const legacyTransactionTextSchema = z.string().min(1).max(240)
