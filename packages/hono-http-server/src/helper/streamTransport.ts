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
	let finalPayload: unknown

	for await (const frame of handle) {
		const payload = frame.payload as StreamTransportFramePayload
		if (payload.frameType === 'complete') {
			finalPayload = payload.final
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

	return {
		status: 'success' as const,
		statusCode: StatusCode.OK as ContentfulStatusCode,
		payload: finalPayload ?? null,
	}
}
