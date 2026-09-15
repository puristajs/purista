import { recordTransactionCommandBuilder } from './command/recordTransaction/recordTransactionCommandBuilder.js'
import { transactionV1ServiceBuilder } from './transactionV1ServiceBuilder.js'

export const transactionV1Service = transactionV1ServiceBuilder.addCommandDefinition(
	recordTransactionCommandBuilder.getDefinition(),
)
