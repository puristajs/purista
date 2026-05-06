import type { EventBridge } from '@purista/core'
import type { AgentInvocationDeliveryMode, AgentStreamResponder } from '../types/AgentDefinition.js'
import type { AgentInvocationTransportOptions } from './agentInvocationTransport.js'
import { invokeAgentInternal } from './agentInvocationTransport.js'

export type InvokeAgentOptions = {
	/** EventBridge instance used to reach the target agent service. */
	eventBridge: EventBridge
	/** Target agent service name. */
	agentName: string
	/** Target agent service version. */
	serviceVersion: string
	/** Payload delivered to the target agent run command. */
	payload: unknown
	/** Optional invoke parameter metadata passed alongside payload. */
	parameter?: unknown
	/** Optional principal id forwarded for scoped memory and auditing. */
	principalId?: string
	/** Optional tenant id forwarded for scoped memory and auditing. */
	tenantId?: string
	/** Optional OTEL parent trace header forwarded across agent boundaries. */
	otp?: string
	/** Optional timeout passed to stream open/invoke calls. */
	timeoutMs?: number
	/** Optional correlation id used for distributed trace chaining. */
	correlationId?: string
	/** Optional trace id used to preserve distributed tracing across agent boundaries. */
	traceId?: string
	/** Optional session id injected into object payloads when missing. */
	sessionId?: string
	/** Optional live frame responder for streaming consumption. */
	stream?: AgentStreamResponder
	/** Stream delivery behavior. Defaults to stream-first with fallback. */
	deliveryMode?: AgentInvocationDeliveryMode
	/**
	 * When true (default), protocol `error` envelopes emitted by the target agent
	 * are treated as invocation failures and throw immediately.
	 */
	failOnErrorFrame?: boolean
}

/**
 * Convenience helper for invoking an agent command via an EventBridge.
 */
export const invokeAgent = async (options: InvokeAgentOptions) => {
	const internalOptions: AgentInvocationTransportOptions = {
		...options,
		deliveryMode: options.deliveryMode ?? 'prefer-stream',
	}
	return await invokeAgentInternal(internalOptions)
}
