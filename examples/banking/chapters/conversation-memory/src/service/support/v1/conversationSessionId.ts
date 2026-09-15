import { createHash } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'

export function conversationSessionId(
	identity: Readonly<{ tenantId?: string; principalId?: string }>,
	conversationId: string,
) {
	if (!identity.tenantId || !identity.principalId) {
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	}
	const digest = createHash('sha256')
		.update(
			JSON.stringify({
				tenantId: identity.tenantId,
				principalId: identity.principalId,
				conversationId,
				version: 'support-conversation-v1',
			}),
		)
		.digest('hex')
	return `support-conversation:${digest}`
}
