import type { CommandFunctionContext, StreamFunctionContext } from '@purista/core'
import {
	createScopedSessionId,
	getPayloadSessionId,
	resolveBaseSessionId as resolveBaseSessionIdFromIdentity,
	type ScopedSessionIdInput,
} from './invocationIdentity.js'

export { createScopedSessionId, getPayloadSessionId }
export type { ScopedSessionIdInput }

/**
 * Resolves the base session id used for implicit session helpers.
 */
export const resolveBaseSessionId = (
	context: CommandFunctionContext | StreamFunctionContext,
	payload: unknown,
): string => {
	return resolveBaseSessionIdFromIdentity({
		payload,
		transportMessageId: context.message.id,
	})
}
