import {
	analyzeTransactionsInputSchema,
	analyzeTransactionsOutputSchema,
} from '../../../../../harness/analysis/transactionAnalysisHarness.js'
import { analysisV1ServiceBuilder } from '../../analysisV1ServiceBuilder.js'
import { transactionAnalysisHarness } from '../../harness/analysisHarnessMount.js'

export const analyzeTransactionsCommandBuilder = analysisV1ServiceBuilder
	.getCommandBuilder('analyzeTransactions', 'Run an isolated transaction analysis')
	.addPayloadSchema(analyzeTransactionsInputSchema)
	.addOutputSchema(analyzeTransactionsOutputSchema)
	.canInvokeAgent(
		'Analysis',
		'1',
		'analyze_transactions',
		transactionAnalysisHarness.contracts.agents.analyze_transactions,
	)
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('POST', 'analysis/transactions')
	.setCommandFunction(async function (context, payload) {
		const outcome = await context.agent.Analysis['1'].analyze_transactions.run(payload, {
			sessionId: `transaction-analysis:${payload.analysisId}`,
		})
		if (outcome.status !== 'completed') throw new Error('Transaction analysis did not complete')
		return outcome.output
	})
