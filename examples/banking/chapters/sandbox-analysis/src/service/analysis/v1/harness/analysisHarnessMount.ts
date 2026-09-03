import type { HarnessBusinessGuardContext } from '@purista/core'
import { transactionAnalysisHarness } from '../../../../harness/analysis/transactionAnalysisHarness.js'
import type { AnalysisPolicy } from '../AnalysisResources.js'
import { requireTransactionAnalysis } from '../requireTransactionAnalysis.js'

export { transactionAnalysisHarness }

export const analysisHarnessPolicy = {
	publish: { agents: ['analyze_transactions'], workflows: [] },
	targets: {
		agents: {
			analyze_transactions: {
				beforeGuards: {
					analysisAccess: async (
						context: HarnessBusinessGuardContext<{ analysisPolicy: AnalysisPolicy }>,
						input: { analysisId: string },
					) => {
						await requireTransactionAnalysis(context.resources.analysisPolicy, {
							...context.identity,
							analysisId: input.analysisId,
						})
					},
				},
			},
		},
		workflows: {},
	},
} as const
