import type { ContextBase, EBMessage } from '@purista/core'
import { HandledError, PuristaSpanName } from '@purista/core'

import type { AgentExecutionResult } from '../runtime/executeAgentWorkload.js'
import {
	type AgentProtocolEnvelope,
	type AgentProtocolFrame,
	createActor,
	createErrorFrame,
	createMessageFrame,
	createProtocolEnvelope,
	createTelemetryFrame,
	createTokenUsage,
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

const deriveConversationId = (message: EBMessage) => message.correlationId ?? message.id

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
		details: {
			stack: err.stack,
			cause: err.cause,
		},
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

export type AgentProtocolRunOptions = PuristaProtocolOptions & {
	summary?: string
	role?: AgentProtocolEnvelope['role']
}

/**
 * Utility used by commands and subscriptions to wrap an agent workload execution call
 * so protocol envelopes (message + telemetry + errors) are emitted consistently.
 */
export const runAgentWithProtocol = async (
	context: ContextBase & { message: EBMessage },
	runner: () => Promise<AgentExecutionResult>,
	options?: AgentProtocolRunOptions,
) => {
	const started = Date.now()
	try {
		const result = await runner()
		const envelopes: AgentProtocolEnvelope[] = [
			createEnvelopeFromContext(
				context,
				createMessageFrame({
					role: options?.role ?? 'assistant',
					content: result.output,
					summary: options?.summary,
					final: true,
				}),
				options,
			),
		]

		if (result.tokens || result.durationMs) {
			envelopes.push(
				createEnvelopeFromContext(
					context,
					createTelemetryFrame({
						usage: result.tokens
							? createTokenUsage({
									promptTokens: result.tokens.prompt,
									completionTokens: result.tokens.completion,
									totalTokens: (result.tokens.prompt ?? 0) + (result.tokens.completion ?? 0),
								})
							: undefined,
						durationMs: result.durationMs ?? Date.now() - started,
						poolId: options?.metadata?.poolId as string | undefined,
						provider: options?.metadata?.provider as string | undefined,
					}),
					options,
				),
			)
		}

		return envelopes
	} catch (error) {
		context.logger?.error({ err: error, agent: context.message.sender.serviceTarget }, 'agent execution failed')
		const envelope = createErrorEnvelopeFromContext(context, error, {
			...options,
			handled: error instanceof HandledError,
		})

		return [envelope]
	}
}
