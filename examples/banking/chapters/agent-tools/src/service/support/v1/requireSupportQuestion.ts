import { createHash } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import type { SupportQuestionPolicy } from './SupportResources.js'

export async function requireSupportQuestion(
	policy: SupportQuestionPolicy,
	input: Readonly<{
		tenantId?: string
		principalId?: string
		accountId: string
		transactionId: string
	}>,
) {
	if (!input.tenantId || !input.principalId)
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	if (
		!(await policy.canAsk({
			tenantId: input.tenantId,
			principalId: input.principalId,
			accountId: input.accountId,
			transactionId: input.transactionId,
		}))
	) {
		throw new HandledError(StatusCode.Forbidden, 'This transaction question is not allowed')
	}
}

export function supportQuestionSessionId(
	identity: Readonly<{ tenantId?: string; principalId?: string }>,
	questionId: string,
) {
	if (!identity.tenantId || !identity.principalId)
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	const digest = createHash('sha256')
		.update(`${identity.tenantId}:${identity.principalId}:${questionId}:support-question-v1`)
		.digest('hex')
	return `support-question:${digest}`
}
