import { HandledError, StatusCode } from '@purista/core'
import { reviewSupportActionWorkflow } from '../../harness/workflow/reviewSupportAction/reviewSupportActionWorkflow.js'
import { decideReviewInputSchema, reviewTerminalSchema } from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const decideCardFreezeCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('decideCardFreeze', 'Authorize and deliver one human review decision')
	.addPayloadSchema(decideReviewInputSchema)
	.addOutputSchema(reviewTerminalSchema)
	.canInvokeWorkflow('Support', '1', reviewSupportActionWorkflow.contract)
	.setBeforeGuardHooks({
		reviewerMayDecide: async function (context, payload) {
			const { tenantId, principalId } = context.message
			if (!tenantId || !principalId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
			if (
				!(await context.resources.supportReviewPolicy.canReview({
					tenantId,
					principalId,
					requestId: payload.requestId,
				}))
			) {
				throw new HandledError(StatusCode.Forbidden, 'This review decision is not allowed')
			}
		},
	})
	.setCommandFunction(async function (context, payload) {
		const { tenantId, principalId } = context.message
		if (!tenantId || !principalId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
		const record = await context.resources.supportReviewStore.decide({ ...payload, tenantId, principalId })
		if (record.status === 'pending') throw new HandledError(StatusCode.Conflict, 'Review decision was not recorded')
		if (!record.approvalInterruptId || !record.approvalRevision || !record.approvalIds?.length) {
			throw new HandledError(StatusCode.Conflict, 'Review approval is not available')
		}
		const { outcome: resumed } = await context.workflow.Support['1'].reviewSupportAction.run(record.workflowInput, {
			sessionId: record.sessionId,
			durable: { runId: record.runId },
			resume: {
				type: 'tool-approval',
				runId: record.runId,
				interruptId: record.approvalInterruptId,
				revision: record.approvalRevision,
				eventId: payload.eventId,
				decisions: record.approvalIds.map((approvalId) => ({ approvalId, approved: payload.outcome === 'approved' })),
			},
		})
		if (resumed.status !== 'completed') throw new Error('Review workflow did not reach a terminal result')

		return { status: record.status, requestId: record.requestId }
	})
