import type { StreamHandle } from '@purista/core'
import { StatusCode } from '@purista/core'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export type ProtocolSseEvent = {
	event: string
	data: unknown
}

export type StreamTransportFramePayload = {
	frameType?: string
	sequence?: number
	chunk?: unknown
	final?: unknown
	error?: {
		status?: number
		message?: string
		isHandledError?: boolean
		data?: unknown
		traceId?: string
	}
}

export const isProtocolSseEvent = (value: unknown): value is ProtocolSseEvent => {
	if (!value || typeof value !== 'object') {
		return false
	}
	const candidate = value as Partial<ProtocolSseEvent>
	return typeof candidate.event === 'string' && 'data' in candidate
}

export const encodeProtocolSseEvent = (encoder: TextEncoder, event: ProtocolSseEvent): Uint8Array => {
	if (event.event === 'data' && event.data === '[DONE]') {
		return encoder.encode('data: [DONE]\n\n')
	}
	return encoder.encode(`event: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`)
}

export const isTransportControlFrame = (frameType: unknown): boolean =>
	typeof frameType === 'string' &&
	(frameType === 'open' || frameType === 'close' || frameType === 'start' || frameType === 'complete')

export const isAgentEnvelopeLike = (value: unknown): value is { frame: { kind?: string } } => {
	if (!value || typeof value !== 'object') {
		return false
	}
	const candidate = value as { version?: unknown; frame?: unknown }
	return typeof candidate.version === 'string' && !!candidate.frame && typeof candidate.frame === 'object'
}

const extractAgentEnvelopes = (value: unknown): Array<{ frame: { kind?: string } }> => {
	if (Array.isArray(value)) {
		return value.filter(isAgentEnvelopeLike)
	}
	if (!value || typeof value !== 'object') {
		return []
	}
	const candidate = value as { envelopes?: unknown }
	if (Array.isArray(candidate.envelopes)) {
		return candidate.envelopes.filter(isAgentEnvelopeLike)
	}
	return []
}

export const isStreamErrorPayload = (
	payload: StreamTransportFramePayload,
): payload is StreamTransportFramePayload & { error: { status?: number; message?: string } } => {
	return payload.frameType === 'error' && !!payload.error && typeof payload.error === 'object'
}

export const resolveHttpStreamingMode = (input: {
	explicitMode?: 'stream' | 'aggregate'
	isDeclaredStreamDefinition: boolean
	responseContentType: string
}): 'stream' | 'aggregate' => {
	return (
		input.explicitMode ??
		(input.isDeclaredStreamDefinition && input.responseContentType.toLowerCase() !== 'text/event-stream'
			? 'aggregate'
			: 'stream')
	)
}

export const collectAggregateStreamResult = async (handle: StreamHandle) => {
	const envelopes: unknown[] = []
	let finalPayload: unknown

	for await (const frame of handle) {
		const payload = frame.payload as StreamTransportFramePayload
		if (payload.frameType === 'chunk' && payload.chunk !== undefined) {
			envelopes.push(payload.chunk)
			continue
		}
		if (payload.frameType === 'complete') {
			finalPayload = payload.final
			if (Array.isArray(payload.final)) {
				envelopes.splice(0, envelopes.length, ...payload.final)
			}
			break
		}
		if (isStreamErrorPayload(payload)) {
			const statusCode =
				typeof payload.error.status === 'number'
					? (payload.error.status as ContentfulStatusCode)
					: StatusCode.InternalServerError
			return {
				status: 'error' as const,
				statusCode,
				payload: payload.error,
			}
		}
	}

	const agentEnvelopes = extractAgentEnvelopes(finalPayload)
	const fallbackEnvelopes = envelopes.filter(isAgentEnvelopeLike)
	const finalEnvelope = (agentEnvelopes.length > 0 ? agentEnvelopes : fallbackEnvelopes).at(-1)
	if (finalEnvelope?.frame?.kind === 'error') {
		return {
			status: 'error' as const,
			statusCode: StatusCode.InternalServerError as ContentfulStatusCode,
			payload: finalPayload ?? finalEnvelope,
		}
	}

	return {
		status: 'success' as const,
		statusCode: StatusCode.OK as ContentfulStatusCode,
		payload: finalPayload ?? null,
	}
}
