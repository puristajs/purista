import type { z } from 'zod'

import type {
	transactionV1GetTransactionInputParameterSchema,
	transactionV1GetTransactionInputPayloadSchema,
	transactionV1GetTransactionOutputPayloadSchema,
}
from './schema.js'

export type TransactionV1GetTransactionInputParameter = z.input<typeof transactionV1GetTransactionInputParameterSchema>

export type TransactionV1GetTransactionInputPayload = z.input<typeof transactionV1GetTransactionInputPayloadSchema>

export type TransactionV1GetTransactionOutputPayload = z.output<typeof transactionV1GetTransactionOutputPayloadSchema>
