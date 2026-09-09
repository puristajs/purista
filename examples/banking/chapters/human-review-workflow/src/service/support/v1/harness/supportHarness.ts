import type { HarnessBusinessGuardContext } from '@purista/core'
import { defineHarness } from '@purista/harness'
import type { z } from 'zod'
import { requireReviewWorkflowAccess } from '../requireReviewWorkflowAccess.js'
import type { SupportReviewPolicy, SupportReviewStore } from '../SupportReviewResources.js'
import { reviewSupportActionWorkflow } from './workflow/reviewSupportAction/reviewSupportActionWorkflow.js'

export const supportHarness = defineHarness({ name: 'supportHumanReview', revision: 'v1' }).addWorkflow(
	reviewSupportActionWorkflow,
)

export const supportHarnessPolicy = {
	targets: {
		workflows: {
			reviewSupportAction: {
				beforeGuards: {
					reviewAccess: async (
						context: HarnessBusinessGuardContext<{
							supportReviewPolicy: SupportReviewPolicy
							supportReviewStore: SupportReviewStore
						}>,
						input: z.output<typeof reviewSupportActionWorkflow.contract.input>,
					) => requireReviewWorkflowAccess(context.resources, context.identity, input),
				},
				durableResume: { identity: 'run-owner' },
			},
		},
	},
} as const
