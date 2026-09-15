import { createHash } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import type { SupportClassificationPolicy } from './SupportResources.js'

export async function requireSupportClassification(
	policy: SupportClassificationPolicy,
	input: Readonly<{ tenantId?: string; principalId?: string; messageId: string }>,
) {
	if (!input.tenantId || !input.principalId)
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	if (
		!(await policy.canClassify({
			tenantId: input.tenantId,
			principalId: input.principalId,
			messageId: input.messageId,
		}))
	) {
		throw new HandledError(StatusCode.Forbidden, 'Support message classification is not allowed')
	}
}

export function supportClassificationSessionId(
	identity: Readonly<{ tenantId?: string; principalId?: string }>,
	messageId: string,
) {
	if (!identity.tenantId || !identity.principalId)
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	const digest = createHash('sha256')
		.update(`${identity.tenantId}:${identity.principalId}:${messageId}:guarded-classification-v1`)
		.digest('hex')
	return `guarded-classification:${digest}`
}
