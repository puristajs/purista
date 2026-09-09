import type { StreamHandle } from '@purista/core'
import { StatusCode } from '@purista/core'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

const SAFE_INTERNAL_STREAM_ERROR_MESSAGE = 'Internal Server Error'

/** Protocol id for the standard AI SDK UI Message Stream v1 transport. */
export const AI_SDK_UI_MESSAGE_STREAM_V1_PROTOCOL = 'ai-sdk-ui-message-stream-v1'

/** Required response headers for AI SDK UI Message Stream v1 consumers. */
export const AI_SDK_UI_MESSAGE_STREAM_V1_HEADERS = Object.freeze({
	'content-type': 'text/event-stream',
	'cache-control': 'no-cache',
	connection: 'keep-alive',
	'x-vercel-ai-ui-message-stream': 'v1',
	'x-accel-buffering': 'no',
})

/**
 * Protocol-native SSE event passed through by stream handlers.
 */
export type ProtocolSseEvent = {
	/** SSE event name. */
	event: string
	/** JSON-serializable event data, or `[DONE]` for data-only completion frames. */
	data: unknown
}

/**
 * Normalized payload shape used by HTTP stream transport frames.
 */
export type StreamTransportFramePayload = {
	/** Frame kind such as `chunk`, `complete`, `error` or transport control frames. */
	frameType?: string
	/** Monotonic stream frame sequence when provided by the stream source. */
	sequence?: number
	/** Incremental stream payload. */
	chunk?: unknown
	/** Final aggregate payload emitted by a completed stream. */
	final?: unknown
	/** Error payload forwarded as problem details or SSE error data. */
	error?: {
		status?: number
		message?: string
		isHandledError?: boolean
		/**
		 * Runs the encodeProtocolSseEvent helper exported by @purista/hono-http-server.
		 * Expose only schemas and metadata that are safe for clients to inspect.
		 */
		data?: unknown
		traceId?: string
	}
	/** Cancellation reason supplied by the stream transport. */
	reason?: string
}

/**
 * Checks whether a stream chunk is already an SSE protocol event.
 */
export const isProtocolSseEvent = (value: unknown): value is ProtocolSseEvent => {
	if (!value || typeof value !== 'object') {
		return false
		/**
		 * Runs the isStreamErrorPayload helper exported by @purista/hono-http-server.
		 * Expose only schemas and metadata that are safe for clients to inspect.
		 */
	}
	const candidate = value as Partial<ProtocolSseEvent>
	return typeof candidate.event === 'string' && 'data' in candidate
}

/**
 * Encodes a protocol SSE event for the HTTP response stream.
 */
export const encodeProtocolSseEvent = (encoder: TextEncoder, event: ProtocolSseEvent): Uint8Array => {
	if (event.event === 'data') {
		const data = event.data === '[DONE]' ? '[DONE]' : JSON.stringify(event.data)
		return encoder.encode(`data: ${data}\n\n`)
	}
	return encoder.encode(`event: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`)
}

/**
 * Maps a PURISTA stream payload to a data-only AI SDK UI Message Stream v1 record.
 *
 * Harness adapter chunks already own their UI message representation and pass
 * through unchanged. Transport failures and cancellation are projected to the
 * standard AI SDK terminal chunk types after SSE headers have been committed.
 */
export const toAiSdkUiMessageStreamEvent = (payload: StreamTransportFramePayload): ProtocolSseEvent | undefined => {
	if (payload.frameType === 'chunk' && isProtocolSseEvent(payload.chunk)) {
		if (payload.chunk.event !== 'data') {
			throw new TypeError('AI SDK UI Message Stream v1 accepts data-only SSE records')
		}
		return payload.chunk
	}

	if (payload.frameType === 'error') {
		return {
			event: 'data',
			data: {
				type: 'error',
				errorText:
					payload.error?.isHandledError === true
						? (payload.error.message ?? SAFE_INTERNAL_STREAM_ERROR_MESSAGE)
						: SAFE_INTERNAL_STREAM_ERROR_MESSAGE,
			},
		}
	}

	if (payload.frameType === 'cancel') {
		return {
			event: 'data',
			data: {
				type: 'abort',
				...(payload.reason === undefined ? {} : { reason: payload.reason }),
			},
		}
	}

	return undefined
}

/**
 * Identifies stream lifecycle frames that are consumed by the HTTP transport.
 */
export const isTransportControlFrame = (frameType: unknown): boolean =>
	typeof frameType === 'string' &&
	(frameType === 'open' ||
		frameType === 'close' ||
		frameType === 'start' ||
		frameType === 'complete' ||
		frameType === 'heartbeat')

/**
 * Narrows a stream frame payload to an error frame.
 */
export const isStreamErrorPayload = (
	payload: StreamTransportFramePayload,
): payload is StreamTransportFramePayload & { error: { status?: number; message?: string } } => {
	return payload.frameType === 'error' && !!payload.error && typeof payload.error === 'object'
}

/**
 * Resolves whether HTTP should stream frames or aggregate a stream's final payload.
 */
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

/**
 * Consumes a PURISTA stream handle until a final or error frame is reached.
 */
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
