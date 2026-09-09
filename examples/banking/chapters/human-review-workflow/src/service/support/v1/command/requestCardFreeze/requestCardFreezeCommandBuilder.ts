import { HandledError, StatusCode } from '@purista/core'
import { reviewSupportActionWorkflow } from '../../harness/workflow/reviewSupportAction/reviewSupportActionWorkflow.js'
import { reviewIdentity } from '../../reviewIdentity.js'
import { requestCardFreezeInputSchema, reviewRequestResultSchema } from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const requestCardFreezeCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('requestCardFreeze', 'Create a durable human review request')
	.addPayloadSchema(requestCardFreezeInputSchema)
	.addOutputSchema(reviewRequestResultSchema)
	.canInvokeWorkflow('Support', '1', reviewSupportActionWorkflow.contract)
	.setBeforeGuardHooks({
		callerMayRequest: async function (context, payload) {
			const { tenantId, principalId } = context.message
			if (!tenantId || !principalId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
			if (
				!(await context.resources.supportReviewPolicy.canRequest({ tenantId, principalId, cardId: payload.cardId }))
			) {
				throw new HandledError(StatusCode.Forbidden, 'This card action is not allowed')
			}
		},
	})
	.setCommandFunction(async function (context, payload) {
		const { tenantId, principalId } = context.message
		if (!tenantId || !principalId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
		const identity = reviewIdentity({ ...payload, tenantId })
		const record = await context.resources.supportReviewStore.create({
			...payload,
			tenantId,
			principalId,
			runId: identity.runId,
			sessionId: identity.sessionId,
			actionDigest: identity.actionDigest,
			workflowInput: identity.workflowInput,
		})
		const { outcome } = await context.workflow.Support['1'].reviewSupportAction.run(record.workflowInput, {
			sessionId: record.sessionId,
			durable: { runId: record.runId },
		})
		if (outcome.status === 'interrupted' && outcome.interrupt.type === 'tool-approval') {
			const request = outcome.interrupt.requests[0]
			if (!request || outcome.interrupt.requests.length !== 1 || request.runId !== record.runId) {
				throw new Error('Review workflow returned an invalid approval request')
			}
			await context.resources.supportReviewStore.recordApproval({
				tenantId,
				requestId: record.requestId,
				runId: record.runId,
				interruptId: outcome.interrupt.id,
				revision: outcome.interrupt.revision,
				approvalIds: [request.approvalId],
				agentRunId: request.agentRunId,
			})
			return {
				status: 'waiting' as const,
				requestId: record.requestId,
				approvalId: request.approvalId,
				interruptId: outcome.interrupt.id,
				revision: outcome.interrupt.revision,
				runId: outcome.runId,
			}
		}
		throw new Error('Review workflow did not produce a tool approval interrupt')
	})
