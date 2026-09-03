import { HandledError, StatusCode } from '@purista/core'
import { reviewSupportActionHarness } from '../../harness/supportHarnessMount.js'
import { reviewIdentity } from '../../reviewIdentity.js'
import { requestCardFreezeInputSchema, reviewRequestResultSchema } from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const requestCardFreezeCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('requestCardFreeze', 'Create a durable human review request')
	.addPayloadSchema(requestCardFreezeInputSchema)
	.addOutputSchema(reviewRequestResultSchema)
	.canInvokeWorkflow(
		'Support',
		'1',
		'review_support_action',
		reviewSupportActionHarness.contracts.workflows.review_support_action,
	)
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('POST', 'support/card-freeze-reviews')
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
		const deadline = new Date(Date.now() + 15 * 60_000).toISOString()
		const identity = reviewIdentity({ ...payload, tenantId }, deadline)
		const record = await context.resources.supportReviewStore.create({
			...payload,
			tenantId,
			principalId,
			waitId: identity.workflowInput.waitId,
			runId: identity.runId,
			sessionId: identity.sessionId,
			actionDigest: identity.actionDigest,
			workflowInput: identity.workflowInput,
		})
		const outcome = await context.workflow.Support['1'].review_support_action.run(record.workflowInput, {
			sessionId: record.sessionId,
			durable: { runId: record.runId },
		})
		if (outcome.status === 'interrupted' && outcome.interrupt.type === 'external-wait') {
			return {
				status: 'waiting' as const,
				requestId: record.requestId,
				waitId: outcome.interrupt.id,
				runId: outcome.runId,
				deadline: outcome.interrupt.deadline,
			}
		}
		if (outcome.status !== 'completed') throw new Error('Unexpected review workflow interrupt')
		return { status: outcome.output.status, requestId: record.requestId }
	})
