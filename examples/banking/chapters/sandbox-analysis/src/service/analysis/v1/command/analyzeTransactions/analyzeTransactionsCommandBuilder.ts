import {
	analyzeTransactionsInputSchema,
	analyzeTransactionsOutputSchema,
} from '../../../../../harness/analysis/transactionAnalysisHarness.js'
import { analysisV1ServiceBuilder } from '../../analysisV1ServiceBuilder.js'
import { transactionAnalysisHarness } from '../../harness/analysisHarnessMount.js'
import { requireTransactionAnalysis, transactionAnalysisSessionId } from '../../requireTransactionAnalysis.js'

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
	.setBeforeGuardHooks({
		analysisAccess: async function (context, payload) {
			await requireTransactionAnalysis(context.resources.analysisPolicy, {
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
				analysisId: payload.analysisId,
			})
		},
	})
	.setCommandFunction(async function (context, payload) {
		const outcome = await context.agent.Analysis['1'].analyze_transactions.run(payload, {
			sessionId: transactionAnalysisSessionId(context.message, payload.analysisId),
		})
		if (outcome.status !== 'completed') throw new Error('Transaction analysis did not complete')
		return outcome.output
	})
