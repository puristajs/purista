import type { HarnessBusinessGuardContext } from '@purista/core'
import { supportHarness } from '../../../../harness/support/supportHarness.js'
import { requireReviewWorkflowAccess } from '../requireReviewWorkflowAccess.js'
import type { SupportReviewPolicy, SupportReviewStore } from '../SupportReviewResources.js'

export { supportHarness }

export const supportHarnessPolicy = {
	publish: { agents: [], workflows: ['review_support_action'] },
	targets: {
		agents: {},
		workflows: {
			review_support_action: {
				beforeGuards: {
					reviewAccess: async (
						context: HarnessBusinessGuardContext<{
							supportReviewPolicy: SupportReviewPolicy
							supportReviewStore: SupportReviewStore
						}>,
						input: Parameters<typeof requireReviewWorkflowAccess>[2],
					) => {
						await requireReviewWorkflowAccess(context.resources, context.identity, input)
					},
				},
				durableResume: { identity: 'run-owner' },
			},
		},
	},
} as const
