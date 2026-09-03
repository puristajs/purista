import type { z } from 'zod'

import type {
	analysisV1SummarizeTransactionsChunkPayloadSchema,
	analysisV1SummarizeTransactionsFinalPayloadSchema,
	analysisV1SummarizeTransactionsInputParameterSchema,
	analysisV1SummarizeTransactionsInputPayloadSchema,
}
from './schema.js'

export type AnalysisV1SummarizeTransactionsInputParameter = z.input<typeof analysisV1SummarizeTransactionsInputParameterSchema>

export type AnalysisV1SummarizeTransactionsInputPayload = z.input<typeof analysisV1SummarizeTransactionsInputPayloadSchema>

export type AnalysisV1SummarizeTransactionsChunkPayload = z.input<typeof analysisV1SummarizeTransactionsChunkPayloadSchema>

export type AnalysisV1SummarizeTransactionsFinalPayload = z.output<typeof analysisV1SummarizeTransactionsFinalPayloadSchema>
