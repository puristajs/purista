import { HandledError, StatusCode } from '@purista/core'
import type { SupportReviewPolicy, SupportReviewStore } from './SupportReviewResources.js'
import type { ReviewWorkflowInput } from './schema.js'

export async function requireReviewWorkflowAccess(
	resources: Readonly<{ supportReviewPolicy: SupportReviewPolicy; supportReviewStore: SupportReviewStore }>,
	identity: Readonly<{ tenantId?: string; principalId?: string }>,
	input: ReviewWorkflowInput,
) {
	const { tenantId, principalId } = identity
	if (!tenantId || !principalId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')

	const record = await resources.supportReviewStore.getByWaitId(tenantId, input.waitId)
	if (!record || record.actionDigest !== input.actionDigest) {
		throw new HandledError(StatusCode.Forbidden, 'This review workflow is not available')
	}

	const allowed =
		record.principalId === principalId
			? await resources.supportReviewPolicy.canRequest({ tenantId, principalId, cardId: record.cardId })
			: await resources.supportReviewPolicy.canReview({ tenantId, principalId, requestId: record.requestId })
	if (!allowed) throw new HandledError(StatusCode.Forbidden, 'This review workflow is not available')
}
