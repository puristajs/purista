import { supportV1ExecuteRollbackSchema, supportV1RollbackReceiptSchema } from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const executeApprovedRollbackCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('executeApprovedRollback', 'Executes one claimed approved rollback and persists its receipt')
	.addPayloadSchema(supportV1ExecuteRollbackSchema)
	.addOutputSchema(supportV1RollbackReceiptSchema)
	.setCommandFunction(async function (context, payload) {
		const claim = await context.resources.rollbackReviewRepository.claimExecution(payload)
		// Recheck trusted state immediately before the idempotent side effect.
		const currentRevision = await context.resources.incidentRepository.getDeploymentRevision(claim.action.changeId)
		if (currentRevision !== claim.action.targetRevision && !claim.receiptId) {
			throw new Error('stale_target_revision')
		}
		const receipt = await context.resources.incidentRepository.executeRollback({
			changeId: claim.action.changeId,
			expectedRevision: claim.action.targetRevision,
			executionId: claim.executionId,
		})
		await context.resources.rollbackReviewRepository.recordReceipt(claim.executionId, receipt.receiptId)
		return {
			reviewId: claim.action.reviewId,
			executionId: claim.executionId,
			receiptId: receipt.receiptId,
			status: 'executed' as const,
		}
	})

