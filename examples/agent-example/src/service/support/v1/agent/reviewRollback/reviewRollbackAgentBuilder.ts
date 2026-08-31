import {
	supportV1RollbackReviewActionSchema,
	supportV1RollbackReviewWorkflowOutputSchema,
} from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const reviewRollbackAgentBuilder = supportV1ServiceBuilder
	.getAgentQueueBuilder('reviewRollback', 'Waits durably for an application-owned rollback decision')
	.addPayloadSchema(supportV1RollbackReviewActionSchema)
	.addOutputSchema(supportV1RollbackReviewWorkflowOutputSchema)
	// Harness currently requires one service-bound alias even though this
	// deterministic workflow does not invoke a model.
	.addModel('primary', { capabilities: ['object'] as const })
	.setSessionPolicy({ mode: 'conversation', payloadPath: ['reviewId'] })
	.setDurability({ mode: 'required', runIdPath: ['reviewId'] })
	.setExecutionProfile('longRunning', { maxRuntimeMs: 15 * 60_000, strict: true })
	.exposeAsHttpEndpoint('POST', 'rollback-review', { streamingMode: 'aggregate' })
	.setHarnessWorkflow({
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
