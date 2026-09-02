import { z } from 'zod'
import { transactionSchema } from '../../transaction.js'

export const transactionV1ExportTransactionInputPayloadSchema = z.undefined()
export const transactionV1ExportTransactionInputParameterSchema = z.object({
	accountId: z.string().trim().min(1),
	transactionId: z.uuid(),
})
export const transactionV1ExportTransactionOutputPayloadSchema = transactionSchema
export const transactionCsvSchema = z.string().min(1)
