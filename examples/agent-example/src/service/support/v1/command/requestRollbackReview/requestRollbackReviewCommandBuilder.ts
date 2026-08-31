import { rollbackActionDigest } from '../../../../../resource/rollbackReviewRepository.js'
import {
	supportV1RollbackReviewActionSchema,
	supportV1RollbackReviewRequestOutputSchema,
} from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const requestRollbackReviewCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('requestRollbackReview', 'Creates the application-owned rollback review record')
	.addPayloadSchema(supportV1RollbackReviewActionSchema)
	.addOutputSchema(supportV1RollbackReviewRequestOutputSchema)
	.setCommandFunction(async function (context, payload) {
		const record = await context.resources.rollbackReviewRepository.getOrCreate(payload)
		return {
			reviewId: record.action.reviewId,
			actionDigest: rollbackActionDigest(record.action),
			status: 'pending' as const,
		}
	})

