import { HandledError, StatusCode } from '@purista/core'
import {
	freezeCardInputSchema,
	freezeCardOutputSchema,
	freezeCardParameterSchema,
} from '../../../../transaction/v1/schema.js'
import { supportHarness } from '../../harness/supportHarnessMount.js'
import { decideReviewInputSchema, reviewTerminalSchema } from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const decideCardFreezeCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('decideCardFreeze', 'Authorize and deliver one human review decision')
	.addPayloadSchema(decideReviewInputSchema)
	.addOutputSchema(reviewTerminalSchema)
	.canInvokeWorkflow('Support', '1', 'review_support_action', supportHarness.contracts.workflows.review_support_action)
	.canInvoke('Transaction', '1', 'freezeCard', freezeCardOutputSchema, freezeCardInputSchema, freezeCardParameterSchema)
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
		const signal = await context.resources.reviewWaitSignal.signal({
			waitId: record.waitId,
			eventId: payload.eventId,
			outcome: payload.outcome,
		})
		if (signal.kind === 'not_found') throw new HandledError(StatusCode.Conflict, 'Review wait is not available')
		const resumed = await context.workflow.Support['1'].review_support_action.run(record.workflowInput, {
			sessionId: record.sessionId,
			durable: { runId: record.runId },
		})
		if (resumed.status !== 'completed') throw new Error('Review workflow did not reach a terminal result')
		if (resumed.output.status === 'approved') {
			await context.service.Transaction['1'].freezeCard({ cardId: record.cardId }, { approvalId: record.runId })
		}
		return { status: resumed.output.status, requestId: record.requestId }
	})
