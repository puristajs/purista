import type { CommandFunctionContext } from '@purista/core'

/**
 * Input required to build the canonical scoped session id used by agent session helpers.
 */
export type ScopedSessionIdInput = {
	agentName: string
	agentVersion: string
	baseSessionId: string
	tenantId?: string
	principalId?: string
}

/**
 * Returns a stable scoped session id that keeps tenant/principal/agent histories isolated.
 *
 * @example
 * ```ts
 * const scoped = createScopedSessionId({
 *   agentName: 'supportAgent',
 *   agentVersion: '1',
 *   baseSessionId: 'msg-1',
 *   tenantId: 'tenant-a',
 *   principalId: 'user-42',
 * })
 * // supportAgent:1:tenant-a:user-42:msg-1
 * ```
 */
export const createScopedSessionId = (input: ScopedSessionIdInput): string => {
	const tenantId = input.tenantId ?? 'global'
	const principalId = input.principalId ?? 'anonymous'
	return `${input.agentName}:${input.agentVersion}:${tenantId}:${principalId}:${input.baseSessionId}`
}

/**
 * Extracts `sessionId` from payload objects when present.
 */
export const getPayloadSessionId = (payload: unknown): string | undefined => {
	if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
		return undefined
	}
	const sessionId = (payload as Record<string, unknown>).sessionId
	return typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : undefined
}

/**
 * Resolves the base session id used for implicit session helpers.
 */
export const resolveBaseSessionId = (context: CommandFunctionContext, payload: unknown): string => {
	return getPayloadSessionId(payload) ?? context.message.id
}
