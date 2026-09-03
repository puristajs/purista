import type { z } from 'zod'

import type {
	transactionV1RecordTransactionInputParameterSchema,
	transactionV1RecordTransactionInputPayloadSchema,
	transactionV1RecordTransactionOutputPayloadSchema,
}
from './schema.js'

export type TransactionV1RecordTransactionInputParameter = z.input<typeof transactionV1RecordTransactionInputParameterSchema>

export type TransactionV1RecordTransactionInputPayload = z.input<typeof transactionV1RecordTransactionInputPayloadSchema>

export type TransactionV1RecordTransactionOutputPayload = z.output<typeof transactionV1RecordTransactionOutputPayloadSchema>
