import { z } from 'zod'
import { newTransactionSchema, transactionSchema } from '../../transaction.js'

export const transactionV1RecordTransactionInputPayloadSchema = newTransactionSchema
export const transactionV1RecordTransactionInputParameterSchema = z.strictObject({
	accountId: z.string().trim().min(1),
})
export const transactionV1RecordTransactionOutputPayloadSchema = transactionSchema
