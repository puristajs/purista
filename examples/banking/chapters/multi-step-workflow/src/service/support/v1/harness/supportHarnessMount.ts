import type { HarnessBusinessGuardContext } from '@purista/core'
import { supportHarness } from '../../../../harness/support/supportHarness.js'
import { requireSupportCaseResolution } from '../requireSupportCaseResolution.js'
import type { SupportCasePolicy } from '../SupportResources.js'

export { supportHarness }

export const supportHarnessPolicy = {
	publish: { agents: [], workflows: ['resolve_support_case'] },
	targets: {
		agents: {},
		workflows: {
			resolve_support_case: {
				beforeGuards: {
					caseAccess: async (
						context: HarnessBusinessGuardContext<{ supportCasePolicy: SupportCasePolicy }>,
						input: { caseId: string },
					) => {
						await requireSupportCaseResolution(context.resources.supportCasePolicy, {
							...context.identity,
							caseId: input.caseId,
						})
					},
				},
			},
		},
	},
} as const
