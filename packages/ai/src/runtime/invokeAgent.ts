import type { Command, EventBridge } from '@purista/core'
import { EBMessageType, getNewEBMessageId, getNewTraceId, StatusCode, UnhandledError } from '@purista/core'

import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { AgentStreamResponder } from '../types/AgentDefinition.js'
import { withSessionIdInPayload } from './sessionPayload.js'

export type InvokeAgentOptions = {
	/** EventBridge instance used to reach the target agent service. */
	eventBridge: EventBridge
	/** Target agent service name. */
	agentName: string
	/** Target agent service version. */
	agentVersion: string
	/** Payload delivered to the target agent run command. */
	payload: unknown
	/** Optional invoke parameter metadata passed alongside payload. */
	parameter?: unknown
	/** Optional principal id forwarded for scoped memory and auditing. */
	principalId?: string
	/** Optional tenant id forwarded for scoped memory and auditing. */
	tenantId?: string
	/** Optional timeout passed to stream open/invoke calls. */
	timeoutMs?: number
	/** Optional correlation id used for distributed trace chaining. */
	correlationId?: string
	/** Optional session id injected into object payloads when missing. */
	sessionId?: string
	/** Optional live frame responder for streaming consumption. */
	stream?: AgentStreamResponder
	/**
	 * When true (default), protocol `error` envelopes emitted by the target agent
	 * are treated as invocation failures and throw immediately.
	 */
	failOnErrorFrame?: boolean
}

const throwIfErrorEnvelope = (envelope: AgentProtocolEnvelope, failOnErrorFrame: boolean | undefined) => {
	if (!(failOnErrorFrame ?? true)) {
		return
	}
	const frame = envelope.frame
	if (frame.kind !== 'error') {
		return
	}
	throw new UnhandledError(StatusCode.InternalServerError, frame.message || 'agent returned error frame', {
		code: frame.code,
		handled: frame.handled,
		details: frame.details,
	})
}

/**
 * Convenience helper for invoking an agent command via an EventBridge.
 */
export const invokeAgent = async (options: InvokeAgentOptions) => {
	const receiver = {
		serviceName: options.agentName,
		serviceVersion: options.agentVersion,
		serviceTarget: 'run',
	} as const

	const payload = withSessionIdInPayload(options.payload, options.sessionId)

	const message: Command = {
		id: getNewEBMessageId(),
		timestamp: Date.now(),
		messageType: EBMessageType.Command,
		traceId: getNewTraceId(),
		correlationId: options.correlationId ?? getNewEBMessageId(),
		contentType: 'application/json',
		contentEncoding: 'utf-8',
		principalId: options.principalId,
		tenantId: options.tenantId,
		sender: {
			serviceName: 'agent.invoke',
			serviceVersion: 'v1',
			serviceTarget: options.agentName,
			instanceId: options.eventBridge.instanceId,
		},
		receiver,
		payload: {
			payload,
			parameter: options.parameter ?? {},
		},
	}

	const streamRequest = {
		traceId: message.traceId,
		sender: message.sender,
		receiver: message.receiver,
		contentType: message.contentType,
		contentEncoding: message.contentEncoding,
		principalId: message.principalId,
		tenantId: message.tenantId,
		payload: {
			frameType: 'open' as const,
			payload: message.payload.payload,
			parameter: message.payload.parameter,
		},
	}

	const emitFrame = async (envelope: AgentProtocolEnvelope) => {
		if (!options.stream) {
			return
		}
		await options.stream.onFrame(envelope)
	}

	try {
		const handle = await options.eventBridge.openStream<AgentProtocolEnvelope, AgentProtocolEnvelope[]>(
			streamRequest,
			options.timeoutMs,
		)
		const envelopes: AgentProtocolEnvelope[] = []
		for await (const frame of handle) {
			if (frame.payload.frameType === 'chunk' && frame.payload.chunk) {
				throwIfErrorEnvelope(frame.payload.chunk, options.failOnErrorFrame ?? true)
				envelopes.push(frame.payload.chunk)
				await emitFrame(frame.payload.chunk)
				continue
			}

			if (frame.payload.frameType === 'complete') {
				if (Array.isArray(frame.payload.final)) {
					if (!envelopes.length) {
						for (const envelope of frame.payload.final) {
							throwIfErrorEnvelope(envelope, options.failOnErrorFrame ?? true)
							envelopes.push(envelope)
							await emitFrame(envelope)
						}
					}
				}
				await options.stream?.onComplete?.()
				return envelopes
			}

			if (frame.payload.frameType === 'error') {
				throw new UnhandledError(
					StatusCode.InternalServerError,
					frame.payload.error?.message ?? 'agent stream failed',
					frame.payload.error,
				)
			}
		}

		await options.stream?.onComplete?.()
		return envelopes
	} catch (error) {
		const isStreamUnavailable =
			(error instanceof UnhandledError &&
				(error.errorCode === StatusCode.NotImplemented || error.errorCode === StatusCode.BadGateway)) ||
			(error instanceof Error &&
				(error.message.includes('does not support streams') || error.message.includes('InvalidCommand')))

		if (!isStreamUnavailable) {
			await options.stream?.onError?.(error)
			throw error
		}
		try {
			const envelopes = (await options.eventBridge.invoke(message, options.timeoutMs)) as AgentProtocolEnvelope[]
			if (options.failOnErrorFrame ?? true) {
				for (const envelope of envelopes) {
					throwIfErrorEnvelope(envelope, true)
				}
			}
			if (options.stream) {
				for (const envelope of envelopes) {
					await options.stream.onFrame(envelope)
				}
				await options.stream.onComplete()
			}
			return envelopes
		} catch (fallbackError) {
			await options.stream?.onError?.(fallbackError)
			throw fallbackError
		}
	}
}
