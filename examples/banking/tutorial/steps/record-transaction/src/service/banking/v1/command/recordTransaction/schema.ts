import { z } from 'zod'
import { recordedTransactionSchema, transactionInputSchema } from '../../../../../transaction.js'

export const bankingV1RecordTransactionInputPayloadSchema = transactionInputSchema
export const bankingV1RecordTransactionInputParameterSchema = z.object({})
export const bankingV1RecordTransactionOutputPayloadSchema = recordedTransactionSchema
