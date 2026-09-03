import { createHash } from 'node:crypto'
import type { ReviewWorkflowInput } from './schema.js'

export function reviewIdentity(
	input: Readonly<{ tenantId: string; requestId: string; cardId: string; reason: string }>,
	deadline: string,
) {
	const actionDigest = createHash('sha256')
		.update(JSON.stringify([input.tenantId, input.requestId, input.cardId, input.reason, 'support-card-freeze-v1']))
		.digest('hex')
	const identityDigest = createHash('sha256')
		.update(`${input.tenantId}:${input.requestId}:support-card-freeze-v1`)
		.digest('hex')
	const workflowInput: ReviewWorkflowInput = {
		waitId: `support-review-wait:${identityDigest}`,
		deadline,
		actionDigest,
		definitionVersion: 'support-card-freeze-v1',
	}
	return {
		actionDigest,
		sessionId: `support-review:${identityDigest}`,
		runId: `support-review-run:${identityDigest}`,
		workflowInput,
	}
}
