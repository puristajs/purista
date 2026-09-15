import type { AnalysisTransaction, TransactionAnalysisScope } from './transactionAnalysis.js'

export interface TransactionAnalysisReader {
	canReadAccount(scope: TransactionAnalysisScope): Promise<boolean>
	listRecent(
		scope: TransactionAnalysisScope,
		limit: number,
		signal?: AbortSignal,
	): Promise<AnalysisTransaction[]>
}
