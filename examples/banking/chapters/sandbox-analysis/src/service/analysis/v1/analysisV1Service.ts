import { analysisV1ServiceBuilder } from './analysisV1ServiceBuilder.js'
import { analyzeTransactionsCommandBuilder } from './command/analyzeTransactions/analyzeTransactionsCommandBuilder.js'
import { analysisHarnessPolicy, transactionAnalysisHarness } from './harness/analysisHarnessMount.js'

export const analysisV1Service = analysisV1ServiceBuilder
	.addCommandDefinition(analyzeTransactionsCommandBuilder.getDefinition())
	.mountHarness(transactionAnalysisHarness, analysisHarnessPolicy)
