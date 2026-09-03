import type { z } from 'zod'
import type { getTransactionSummaryOutputSchema } from './schema.js'

export type StoredTransactionSummary = z.output<typeof getTransactionSummaryOutputSchema>

export interface TransactionSummaryReader {
	getById(transactionId: string): Promise<StoredTransactionSummary | undefined>
}

export interface AccountReadPolicy {
	canRead(input: Readonly<{ tenantId: string; principalId: string; accountId: string }>): Promise<boolean>
}
