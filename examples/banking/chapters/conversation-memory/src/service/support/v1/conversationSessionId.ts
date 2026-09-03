import { HandledError, StatusCode } from '@purista/core'

export function conversationSessionId(
	identity: Readonly<{ tenantId?: string; principalId?: string }>,
	conversationId: string,
) {
	if (!identity.tenantId || !identity.principalId) {
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	}
	return `support:${identity.tenantId}:${identity.principalId}:${conversationId}`
}
