import type { z } from 'zod'

import type {
	transactionV1ExportTransactionInputParameterSchema,
	transactionV1ExportTransactionInputPayloadSchema,
	transactionV1ExportTransactionOutputPayloadSchema,
}
from './schema.js'

export type TransactionV1ExportTransactionInputParameter = z.input<typeof transactionV1ExportTransactionInputParameterSchema>

export type TransactionV1ExportTransactionInputPayload = z.input<typeof transactionV1ExportTransactionInputPayloadSchema>

export type TransactionV1ExportTransactionOutputPayload = z.output<typeof transactionV1ExportTransactionOutputPayloadSchema>
