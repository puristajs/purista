import type { HarnessBusinessGuardContext } from '@purista/core'
import { defineHarness } from '@purista/harness'
import type { z } from 'zod'
import { requireReviewWorkflowAccess } from '../requireReviewWorkflowAccess.js'
import type { SupportReviewPolicy, SupportReviewStore } from '../SupportReviewResources.js'
import { supportV1ServiceBuilder } from '../supportV1ServiceBuilder.js'
import { reviewSupportActionWorkflow } from './workflow/reviewSupportAction/reviewSupportActionWorkflow.js'

export const supportHarness = defineHarness({ name: 'supportHumanReview', revision: 'v1' }).addWorkflow(
	reviewSupportActionWorkflow,
)

export const supportHarnessPolicy = supportV1ServiceBuilder.defineHarnessPolicy(supportHarness, {
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
})
