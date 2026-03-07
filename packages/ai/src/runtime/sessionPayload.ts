/**
 * Injects `sessionId` into object payloads when not explicitly set by the caller.
 *
 * Primitive payloads and arrays are returned unchanged.
 */
export const withSessionIdInPayload = <TPayload>(payload: TPayload, sessionId?: string): TPayload => {
	if (!sessionId || !payload || typeof payload !== 'object' || Array.isArray(payload)) {
		return payload
	}
	const current = payload as Record<string, unknown>
	if (typeof current.sessionId === 'string' && current.sessionId.length > 0) {
		return payload
	}
	return {
		...current,
		sessionId,
	} as TPayload
}
