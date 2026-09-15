import { analysisV1ServiceBuilder } from './analysisV1ServiceBuilder.js'
import { runAnalyzeTransactionsCommandBuilder } from './command/runAnalyzeTransactions/runAnalyzeTransactionsCommandBuilder.js'
import { analysisHarness, analysisHarnessPolicy } from './harness/analysisHarness.js'

export const analysisV1Service = analysisV1ServiceBuilder
	.addCommandDefinition(runAnalyzeTransactionsCommandBuilder.getDefinition())
	.mountHarness(analysisHarness, analysisHarnessPolicy)
