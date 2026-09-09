import { HandledError, StatusCode } from '@purista/core'
import { analysisV1ServiceBuilder } from '../../analysisV1ServiceBuilder.js'
import { analyzeTransactionsAgent } from '../../harness/agent/analyzeTransactions/analyzeTransactionsAgent.js'
import { analyzeTransactionsInputSchema, analyzeTransactionsOutputSchema } from '../../harness/analysisSchemas.js'
import { requireTransactionAnalysis, transactionAnalysisSessionId } from '../../requireTransactionAnalysis.js'

export const runAnalyzeTransactionsCommandBuilder = analysisV1ServiceBuilder
	.getCommandBuilder('runAnalyzeTransactions', 'Run an isolated transaction analysis')
	.addPayloadSchema(analyzeTransactionsInputSchema)
	.addOutputSchema(analyzeTransactionsOutputSchema)
	.canInvokeAgent('Analysis', '1', analyzeTransactionsAgent.contract)
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
		const tenantId = context.message.tenantId
		const principalId = context.message.principalId
		if (!tenantId || !principalId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
		const { outcome } = await context.agent.Analysis['1'][analyzeTransactionsAgent.contract.id].run(payload, {
			sessionId: transactionAnalysisSessionId({ tenantId, principalId }, payload.analysisId),
		})
		if (outcome.status !== 'completed') throw new Error('Transaction analysis did not complete')
		return outcome.output
	})
