import { defineHarnessModule } from '@purista/harness'

import {
	supportV1RollbackReviewActionSchema,
	supportV1RollbackReviewWorkflowOutputSchema,
} from '../../../service/support/v1/schema.js'

/** Pauses durable work until an authorized application review resumes it. */
export const reviewRollbackWorkflow = defineHarnessModule()('support.workflow.review-rollback', {
	version: '1.0.0',
	register(builder) {
		return builder.workflow('review_rollback', {
			input: supportV1RollbackReviewActionSchema,
			output: supportV1RollbackReviewWorkflowOutputSchema,
			handler: async context => {
				const action = await context.step('bind-reviewed-action-v1', async () => context.input)
				const outcome = await context.externalWait.wait({
					waitId: `rollback-review:${action.reviewId}`,
					kind: 'human_review',
					schemaVersion: 'rollback-review-v1',
					definitionVersion: 'support-v1',
					deadline: action.expiresAt,
				})
				return { status: outcome.status, reviewId: action.reviewId }
			},
		})
	},
})
