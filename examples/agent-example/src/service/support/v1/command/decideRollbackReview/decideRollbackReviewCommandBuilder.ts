import {
	supportV1RollbackReviewDecisionOutputSchema,
	supportV1RollbackReviewDecisionSchema,
} from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const decideRollbackReviewCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('decideRollbackReview', 'Records an authorized review decision and signals the durable wait')
	.addPayloadSchema(supportV1RollbackReviewDecisionSchema)
	.addOutputSchema(supportV1RollbackReviewDecisionOutputSchema)
	.setCommandFunction(async function (context, payload) {
		const review = await context.resources.rollbackReviewRepository.decide(payload)
		const signal = await context.resources.harnessStorage.signalWait({
			waitId: `rollback-review:${payload.reviewId}`,
			eventId: payload.decisionId,
			outcome: payload.decision,
		})
		if (signal.kind === 'not_found') throw new Error('durable_wait_not_found')
		return { reviewId: review.action.reviewId, status: payload.decision, signal: signal.kind }
	})

