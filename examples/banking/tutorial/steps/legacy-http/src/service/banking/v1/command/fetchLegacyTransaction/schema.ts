import { z } from 'zod'
import { accountIdSchema, recordedTransactionSchema } from '../../../../../transaction.js'

export const bankingV1FetchLegacyTransactionInputPayloadSchema = z.object({})
export const bankingV1FetchLegacyTransactionInputParameterSchema = z.object({
	accountId: accountIdSchema,
	sourceId: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/),
})
export const bankingV1FetchLegacyTransactionOutputPayloadSchema = recordedTransactionSchema
