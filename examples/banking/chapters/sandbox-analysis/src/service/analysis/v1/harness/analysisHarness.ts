import type { HarnessBusinessGuardContext } from '@purista/core'
import { defineHarness } from '@purista/harness'
import type { z } from 'zod'
import type { AnalysisPolicy } from '../AnalysisResources.js'
import { analysisV1ServiceBuilder } from '../analysisV1ServiceBuilder.js'
import { requireTransactionAnalysis } from '../requireTransactionAnalysis.js'
import { analyzeTransactionsAgent } from './agent/analyzeTransactions/analyzeTransactionsAgent.js'

export const analysisHarness = defineHarness({ name: 'transactionAnalysis', revision: 'v1' }).addAgent(
	analyzeTransactionsAgent,
)

export const analysisHarnessPolicy = analysisV1ServiceBuilder.defineHarnessPolicy(analysisHarness, {
	agents: {
		analyzeTransactions: {
			beforeGuards: {
				analysisAccess: async (
					context: HarnessBusinessGuardContext<{ analysisPolicy: AnalysisPolicy }>,
					input: z.output<typeof analyzeTransactionsAgent.contract.input>,
				) =>
					requireTransactionAnalysis(context.resources.analysisPolicy, {
						...context.identity,
						analysisId: input.analysisId,
					}),
			},
		},
	},
})
