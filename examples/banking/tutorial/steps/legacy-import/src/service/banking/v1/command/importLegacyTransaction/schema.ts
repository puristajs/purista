import { z } from 'zod'
import { recordedTransactionSchema, transactionInputSchema } from '../../../../../transaction.js'

export const bankingV1ImportLegacyTransactionInputPayloadSchema = transactionInputSchema
export const bankingV1ImportLegacyTransactionInputParameterSchema = z.object({})
export const bankingV1ImportLegacyTransactionOutputPayloadSchema = recordedTransactionSchema
