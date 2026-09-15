import { z } from 'zod'
import { createTransactionSchema, transactionSchema } from '../../transaction.js'

export const transactionV1RecordTransactionInputPayloadSchema = createTransactionSchema
export const transactionV1RecordTransactionInputParameterSchema = z.object({})
export const transactionV1RecordTransactionOutputPayloadSchema = transactionSchema
