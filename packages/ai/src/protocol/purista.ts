import type { ContextBase, EBMessage } from '@purista/core'
import { PuristaSpanName } from '@purista/core'

import { createProtocolSafeErrorDetails } from '../runtime/errorDiagnostics.js'
import { resolveConversationId } from '../runtime/invocationIdentity.js'
import {
	type AgentProtocolEnvelope,
	type AgentProtocolFrame,
	createActor,
	createErrorFrame,
	createProtocolEnvelope,
	type ProtocolActor,
} from './index.js'

export type PuristaProtocolOptions = {
	conversationId?: string
	inReplyTo?: string
	actor?: ProtocolActor
	userId?: string
	tenantId?: string
	metadata?: Record<string, unknown>
}

const deriveActor = (message: EBMessage): ProtocolActor =>
	createActor({
		service: message.sender.serviceName,
		version: message.sender.serviceVersion,
		agent: message.sender.serviceTarget,
		instanceId: message.sender.instanceId,
	})

const deriveConversationId = (message: EBMessage) =>
	resolveConversationId({
		payload: message.payload,
		transportMessageId: message.id,
		sessionId: undefined,
	})

export const createEnvelopeFromContext = (
	context: ContextBase & { message: EBMessage },
	frame: AgentProtocolFrame,
	overrides?: PuristaProtocolOptions,
): AgentProtocolEnvelope => {
	return createProtocolEnvelope({
		conversationId: overrides?.conversationId ?? deriveConversationId(context.message),
		inReplyTo: overrides?.inReplyTo ?? context.message.id,
		actor: overrides?.actor ?? deriveActor(context.message),
		frame,
		metadata: overrides?.metadata,
		role: overrides?.actor ? undefined : 'assistant',
		userId: overrides?.userId ?? context.message.principalId,
		tenantId: overrides?.tenantId ?? context.message.tenantId,
	})
}

export const createErrorEnvelopeFromContext = (
	context: ContextBase & { message: EBMessage },
	error: unknown,
	overrides?: PuristaProtocolOptions & { code?: string; handled?: boolean },
) => {
	const err =
		error instanceof Error
			? error
			: new Error(typeof error === 'string' ? error : 'Unknown agent error', {
					cause: error,
				})

	const frame = createErrorFrame({
		code: overrides?.code ?? 'AgentError',
		message: err.message,
		handled: overrides?.handled ?? false,
		details: createProtocolSafeErrorDetails(error),
	})

	return createEnvelopeFromContext(context, frame, overrides)
}

export const recordProtocolFrameAsSpan = async (
	context: ContextBase,
	name: string,
	frame: AgentProtocolFrame,
	fn: () => Promise<AgentProtocolEnvelope>,
) => {
	return context.startActiveSpan(name ?? PuristaSpanName.EventBridgeInvokeCommand, {}, undefined, async span => {
		const envelope = await fn()
		span.setAttribute('purista.ai.protocol', envelope.version)
		span.setAttribute('purista.ai.frame', frame.kind)
		return envelope
	})
}
