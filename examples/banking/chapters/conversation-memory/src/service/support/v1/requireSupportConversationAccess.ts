import { HandledError, StatusCode } from '@purista/core'
import type { SupportConversationAction, SupportConversationPolicy } from './SupportConversationPolicy.js'

export async function requireSupportConversationAccess(
	policy: SupportConversationPolicy,
	identity: Readonly<{ tenantId?: string; principalId?: string }>,
	conversationId: string,
	action: SupportConversationAction,
) {
	if (!identity.tenantId || !identity.principalId) {
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	}
	if (
		!(await policy.canAccess({
			tenantId: identity.tenantId,
			principalId: identity.principalId,
			conversationId,
			action,
		}))
	) {
		throw new HandledError(StatusCode.Forbidden, 'This support conversation is not available')
	}
}
