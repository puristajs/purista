import { getTransactionSummaryCommandBuilder } from './command/getTransactionSummary/getTransactionSummaryCommandBuilder.js'
import { transactionV1ServiceBuilder } from './transactionV1ServiceBuilder.js'

export const transactionV1Service = transactionV1ServiceBuilder.addCommandDefinition(
	getTransactionSummaryCommandBuilder.getDefinition(),
)
