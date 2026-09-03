import { defineHarness } from '@purista/harness'
import { analyzeTransactionsAgent } from './agent/analyzeTransactions/analyzeTransactionsAgent.js'

export const analysisHarness = defineHarness({ name: 'transaction-analysis' })
	.requireModel('analysis_model', { capabilities: ['object', 'tool_use'] })
	.use(analyzeTransactionsAgent)
	.define()
