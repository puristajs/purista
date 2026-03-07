import type { Command, EventBridge } from '@purista/core'
import { EBMessageType, getNewEBMessageId, getNewTraceId, StatusCode, UnhandledError } from '@purista/core'

import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { AgentStreamResponder } from '../types/AgentDefinition.js'
import { withSessionIdInPayload } from './sessionPayload.js'

export type InvokeAgentOptions = {
	eventBridge: EventBridge
	agentName: string
	agentVersion: string
	payload: unknown
	parameter?: unknown
	principalId?: string
	tenantId?: string
	timeoutMs?: number
	correlationId?: string
	sessionId?: string
	stream?: AgentStreamResponder
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

	const emitFrame = (envelope: AgentProtocolEnvelope) => {
		if (!options.stream) {
			return
		}
		options.stream.onFrame(envelope)
	}

	try {
		const handle = await options.eventBridge.openStream<AgentProtocolEnvelope, AgentProtocolEnvelope[]>(
			streamRequest,
			options.timeoutMs,
		)
		const envelopes: AgentProtocolEnvelope[] = []
		for await (const frame of handle) {
			if (frame.payload.frameType === 'chunk' && frame.payload.chunk) {
				envelopes.push(frame.payload.chunk)
				emitFrame(frame.payload.chunk)
				continue
			}

			if (frame.payload.frameType === 'complete') {
				if (Array.isArray(frame.payload.final)) {
					if (!envelopes.length) {
						for (const envelope of frame.payload.final) {
							envelopes.push(envelope)
							emitFrame(envelope)
						}
					}
				}
				options.stream?.onComplete()
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

		options.stream?.onComplete()
		return envelopes
	} catch (error) {
		const isStreamUnavailable =
			(error instanceof UnhandledError &&
				(error.errorCode === StatusCode.NotImplemented || error.errorCode === StatusCode.BadGateway)) ||
			(error instanceof Error &&
				(error.message.includes('does not support streams') || error.message.includes('InvalidCommand')))

		if (!isStreamUnavailable) {
			options.stream?.onError(error)
			throw error
		}
		try {
			const envelopes = (await options.eventBridge.invoke(message, options.timeoutMs)) as AgentProtocolEnvelope[]
			if (options.stream) {
				for (const envelope of envelopes) {
					options.stream.onFrame(envelope)
				}
				options.stream.onComplete()
			}
			return envelopes
		} catch (fallbackError) {
			options.stream?.onError(fallbackError)
			throw fallbackError
		}
	}
}
