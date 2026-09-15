import { z } from 'zod'
import { transactionSchema } from '../../transaction.js'

export const transactionV1GetTransactionInputPayloadSchema = z.undefined()
export const transactionV1GetTransactionInputParameterSchema = z.object({
	accountId: z.string().trim().min(1),
	transactionId: z.uuid(),
})
export const transactionV1GetTransactionOutputPayloadSchema = transactionSchema
