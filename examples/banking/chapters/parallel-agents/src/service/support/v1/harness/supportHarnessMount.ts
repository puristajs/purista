import type { HarnessBusinessGuardContext } from '@purista/core'
import { supportCaseAnalysisHarness } from '../../../../harness/support/supportCaseAnalysisHarness.js'
import { requireSupportCaseAnalysis } from '../requireSupportCaseAnalysis.js'
import type { SupportCasePolicy } from '../SupportResources.js'

export { supportCaseAnalysisHarness }

export const supportHarnessPolicy = {
	publish: { agents: [], workflows: ['analyze_support_case'] },
	targets: {
		agents: {},
		workflows: {
			analyze_support_case: {
				beforeGuards: {
					caseAccess: async (
						context: HarnessBusinessGuardContext<{ supportCasePolicy: SupportCasePolicy }>,
						input: { caseId: string },
					) => {
						await requireSupportCaseAnalysis(context.resources.supportCasePolicy, {
							...context.identity,
							caseId: input.caseId,
						})
					},
				},
			},
		},
	},
} as const
