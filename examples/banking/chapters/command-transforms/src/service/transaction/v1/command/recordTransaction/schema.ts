import { z } from 'zod'
import { createTransactionSchema, transactionSchema } from '../../transaction.js'

export const transactionV1RecordTransactionInputPayloadSchema = createTransactionSchema
export const transactionV1RecordTransactionInputParameterSchema = z.object({
	accountId: z.string().trim().min(1),
})
export const transactionV1RecordTransactionOutputPayloadSchema = transactionSchema
