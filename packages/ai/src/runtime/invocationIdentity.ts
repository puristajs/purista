import type { EBMessage } from '@purista/core'
import type { ConversationStoreScope } from '../memory/conversationStore.js'

export type ScopedSessionIdInput = {
	agentName: string
	serviceVersion: string
	baseSessionId: string
	tenantId?: string
	principalId?: string
}

export type AgentTransportIdentity = {
	traceId: string
	otp?: string
	correlationId: string
	transportMessageId: string
	principalId?: string
	tenantId?: string
}

export type AgentInvocationIdentity = AgentTransportIdentity & {
	agentName: string
	serviceVersion: string
	baseSessionId: string
	scopedSessionId: string
	conversationId: string
}

type MessageWithTransportIdentity = Pick<
	EBMessage,
	'id' | 'traceId' | 'otp' | 'correlationId' | 'principalId' | 'tenantId'
> & {
	payload?: unknown
}

const unwrapCommandPayload = (value: unknown): unknown => {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return value
	}
	if ('payload' in value) {
		return (value as { payload?: unknown }).payload
	}
	return value
}

/**
 * Returns a stable scoped session id that keeps tenant/principal/agent histories isolated.
 */
export const createScopedSessionId = (input: ScopedSessionIdInput): string => {
	const tenantId = input.tenantId ?? 'global'
	const principalId = input.principalId ?? 'anonymous'
	return `${input.agentName}:${input.serviceVersion}:${tenantId}:${principalId}:${input.baseSessionId}`
}

/**
 * Extracts `sessionId` from payload objects when present.
 */
export const getPayloadSessionId = (payload: unknown): string | undefined => {
	const candidate = unwrapCommandPayload(payload)
	if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
		return undefined
	}
	const sessionId = (candidate as Record<string, unknown>).sessionId
	return typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : undefined
}

/**
 * Resolves the logical conversation/session id for one invocation.
 */
export const resolveBaseSessionId = (input: {
	payload?: unknown
	transportMessageId: string
	sessionId?: string
}): string => {
	return input.sessionId ?? getPayloadSessionId(input.payload) ?? input.transportMessageId
}

export const resolveConversationId = (input: {
	payload?: unknown
	transportMessageId: string
	sessionId?: string
}): string => {
	return resolveBaseSessionId(input)
}

export const resolveTransportIdentity = (message: MessageWithTransportIdentity): AgentTransportIdentity => ({
	traceId: message.traceId ?? message.id,
	otp: message.otp,
	correlationId: message.correlationId ?? message.id,
	transportMessageId: message.id,
	principalId: message.principalId,
	tenantId: message.tenantId,
})

/**
 * Builds the canonical runtime identity used across protocol, memory, and telemetry.
 */
export const resolveAgentInvocationIdentity = (input: {
	agentName: string
	serviceVersion: string
	message: MessageWithTransportIdentity
	payload?: unknown
	sessionId?: string
}): AgentInvocationIdentity => {
	const transport = resolveTransportIdentity(input.message)
	const baseSessionId = resolveBaseSessionId({
		payload: input.payload ?? input.message.payload,
		transportMessageId: transport.transportMessageId,
		sessionId: input.sessionId,
	})

	return {
		...transport,
		agentName: input.agentName,
		serviceVersion: input.serviceVersion,
		baseSessionId,
		conversationId: baseSessionId,
		scopedSessionId: createScopedSessionId({
			agentName: input.agentName,
			serviceVersion: input.serviceVersion,
			baseSessionId,
			tenantId: transport.tenantId,
			principalId: transport.principalId,
		}),
	}
}

export const createConversationStoreScope = (
	identity: Pick<AgentInvocationIdentity, 'agentName' | 'serviceVersion' | 'tenantId' | 'principalId'>,
): ConversationStoreScope => ({
	agentName: identity.agentName,
	serviceVersion: identity.serviceVersion,
	tenantId: identity.tenantId,
	principalId: identity.principalId,
})
