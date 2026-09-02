import type { z } from 'zod'

import type {
	transactionV1ImportLegacyTransactionInputParameterSchema,
	transactionV1ImportLegacyTransactionInputPayloadSchema,
	transactionV1ImportLegacyTransactionOutputPayloadSchema,
}
from './schema.js'

export type TransactionV1ImportLegacyTransactionInputParameter = z.input<typeof transactionV1ImportLegacyTransactionInputParameterSchema>

export type TransactionV1ImportLegacyTransactionInputPayload = z.input<typeof transactionV1ImportLegacyTransactionInputPayloadSchema>

export type TransactionV1ImportLegacyTransactionOutputPayload = z.output<typeof transactionV1ImportLegacyTransactionOutputPayloadSchema>
