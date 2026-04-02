import type { Command, EventBridge } from '@purista/core'
import {
	EBMessageType,
	getNewEBMessageId,
	getNewTraceId,
	HandledError,
	StatusCode,
	UnhandledError,
} from '@purista/core'

import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { AgentInvocationDeliveryMode, AgentStreamResponder } from '../types/AgentDefinition.js'
import { getAgentReceiverAddress } from './agentAddress.js'
import { withSessionIdInPayload } from './sessionPayload.js'

export type AgentInvocationTransportOptions = {
	eventBridge: EventBridge
	agentName: string
	agentVersion: string
	payload: unknown
	parameter?: unknown
	principalId?: string
	tenantId?: string
	timeoutMs?: number
	correlationId?: string
	traceId?: string
	sessionId?: string
	stream?: AgentStreamResponder
	failOnErrorFrame?: boolean
	deliveryMode?: AgentInvocationDeliveryMode
	sender?: {
		serviceName: string
		serviceVersion: string
		serviceTarget: string
		instanceId?: string
	}
}

const throwIfErrorEnvelope = (envelope: AgentProtocolEnvelope, failOnErrorFrame: boolean | undefined) => {
	if (!(failOnErrorFrame ?? true)) {
		return
	}
	const frame = envelope.frame
	if (frame.kind !== 'error') {
		return
	}
	const statusCode =
		typeof frame.code === 'string' && /^\d+$/.test(frame.code)
			? Number.parseInt(frame.code, 10)
			: StatusCode.InternalServerError
	if (frame.handled) {
		throw new HandledError(statusCode, frame.message || 'agent returned handled error frame', {
			code: frame.code,
			handled: frame.handled,
			details: frame.details,
		})
	}
	throw new UnhandledError(statusCode, frame.message || 'agent returned error frame', {
		code: frame.code,
		handled: frame.handled,
		details: frame.details,
	})
}

const mergeUniqueEnvelopes = (current: AgentProtocolEnvelope[], final: AgentProtocolEnvelope[]) => {
	const seen = new Set(current.map(envelope => JSON.stringify(envelope)))
	const additions: AgentProtocolEnvelope[] = []
	for (const envelope of final) {
		const key = JSON.stringify(envelope)
		if (seen.has(key)) {
			continue
		}
		seen.add(key)
		additions.push(envelope)
	}
	return additions
}

const isStreamUnavailableError = (error: unknown) =>
	(error instanceof UnhandledError &&
		(error.errorCode === StatusCode.NotImplemented || error.errorCode === StatusCode.BadGateway)) ||
	(error instanceof Error &&
		(error.message.includes('does not support streams') || error.message.includes('InvalidCommand')))

export const invokeAgentInternal = async (options: AgentInvocationTransportOptions) => {
	const receiver = getAgentReceiverAddress(options.agentName, options.agentVersion)
	const payload = withSessionIdInPayload(options.payload, options.sessionId)
	const sender = options.sender ?? {
		serviceName: 'agent.invoke',
		serviceVersion: 'v1',
		serviceTarget: options.agentName,
		instanceId: options.eventBridge.instanceId,
	}

	const message: Command = {
		id: getNewEBMessageId(),
		timestamp: Date.now(),
		messageType: EBMessageType.Command,
		traceId: options.traceId ?? getNewTraceId(),
		correlationId: options.correlationId ?? getNewEBMessageId(),
		contentType: 'application/json',
		contentEncoding: 'utf-8',
		principalId: options.principalId,
		tenantId: options.tenantId,
		sender: {
			serviceName: sender.serviceName,
			serviceVersion: sender.serviceVersion,
			serviceTarget: sender.serviceTarget,
			instanceId: sender.instanceId ?? options.eventBridge.instanceId,
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

	const deliveryMode = options.deliveryMode ?? 'prefer-stream'

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
					for (const envelope of mergeUniqueEnvelopes(envelopes, frame.payload.final)) {
						throwIfErrorEnvelope(envelope, options.failOnErrorFrame ?? true)
						envelopes.push(envelope)
						await emitFrame(envelope)
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
		if (deliveryMode === 'require-stream' || !isStreamUnavailableError(error)) {
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
