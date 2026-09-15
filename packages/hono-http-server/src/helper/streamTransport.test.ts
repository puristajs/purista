import { DefaultChatTransport, readUIMessageStream, type UIMessage, type UIMessageChunk } from 'ai'
import { describe, expect, it } from 'vitest'

import {
	collectAggregateStreamResult,
	encodeProtocolSseEvent,
	isProtocolSseEvent,
	isStreamErrorPayload,
	isTransportControlFrame,
	resolveHttpStreamingMode,
	toAiSdkUiMessageStreamEvent,
} from './streamTransport.js'

class InspectableChatTransport extends DefaultChatTransport<UIMessage> {
	read(stream: ReadableStream<Uint8Array>) {
		return this.processResponseStream(stream)
	}
}

const officialReader = new InspectableChatTransport()

const encodeUiMessageStream = (chunks: readonly (UIMessageChunk | '[DONE]')[]) => {
	const encoder = new TextEncoder()
	return new ReadableStream<Uint8Array>({
		start(controller) {
			for (const chunk of chunks) {
				controller.enqueue(encodeProtocolSseEvent(encoder, { event: 'data', data: chunk }))
			}
			controller.close()
		},
	})
}

describe('streamTransport helpers', () => {
	it('detects protocol SSE events', () => {
		expect(isProtocolSseEvent({ event: 'data', data: { ok: true } })).toBe(true)
		expect(isProtocolSseEvent({ data: {} })).toBe(false)
		expect(isProtocolSseEvent(null)).toBe(false)
	})

	it('encodes [DONE] SSE events without event prefix', () => {
		const encoder = new TextEncoder()
		const value = new TextDecoder().decode(encodeProtocolSseEvent(encoder, { event: 'data', data: '[DONE]' }))
		expect(value).toBe('data: [DONE]\n\n')
	})

	it('encodes data events without a custom SSE event name', () => {
		const encoder = new TextEncoder()
		const value = new TextDecoder().decode(
			encodeProtocolSseEvent(encoder, { event: 'data', data: { type: 'text-delta', delta: 'hello' } }),
		)
		expect(value).toBe('data: {"type":"text-delta","delta":"hello"}\n\n')
	})

	it('produces records consumed directly by the official AI SDK v7 stream reader', async () => {
		const parsedChunks: UIMessageChunk[] = []
		const stream = officialReader.read(
			encodeUiMessageStream([
				{ type: 'start', messageId: 'assistant-1' },
				{ type: 'start-step' },
				{ type: 'text-start', id: 'answer' },
				{ type: 'text-delta', id: 'answer', delta: 'hello' },
				{ type: 'text-end', id: 'answer' },
				{ type: 'finish-step' },
				{ type: 'finish', finishReason: 'stop' },
				'[DONE]',
			]),
		)
		for await (const chunk of stream) parsedChunks.push(chunk)

		let finalMessage: UIMessage | undefined
		for await (const message of readUIMessageStream({
			stream: officialReader.read(encodeUiMessageStream(parsedChunks)),
		})) {
			finalMessage = message
		}

		expect(parsedChunks.map(chunk => chunk.type)).toEqual([
			'start',
			'start-step',
			'text-start',
			'text-delta',
			'text-end',
			'finish-step',
			'finish',
		])
		expect(finalMessage?.parts).toContainEqual(expect.objectContaining({ type: 'text', text: 'hello' }))
	})

	it('preserves handled stream errors and redacts unhandled diagnostics', () => {
		expect(
			toAiSdkUiMessageStreamEvent({
				frameType: 'error',
				error: { status: 403, message: 'Safe permission denial', isHandledError: true },
			}),
		).toEqual({ event: 'data', data: { type: 'error', errorText: 'Safe permission denial' } })

		const privateSentinel = 'PRIVATE_DATABASE_CONNECTION_DETAILS'
		const unhandled = toAiSdkUiMessageStreamEvent({
			frameType: 'error',
			error: { status: 500, message: privateSentinel, isHandledError: false },
		})
		expect(unhandled).toEqual({ event: 'data', data: { type: 'error', errorText: 'Internal Server Error' } })
		expect(JSON.stringify(unhandled)).not.toContain(privateSentinel)
	})

	it('detects transport control frames', () => {
		expect(isTransportControlFrame('open')).toBe(true)
		expect(isTransportControlFrame('complete')).toBe(true)
		expect(isTransportControlFrame('heartbeat')).toBe(true)
		expect(isTransportControlFrame('chunk')).toBe(false)
	})

	it('detects stream error payloads', () => {
		expect(isStreamErrorPayload({ frameType: 'error', error: { message: 'boom' } })).toBe(true)
		expect(isStreamErrorPayload({ frameType: 'chunk' })).toBe(false)
	})

	it('resolves aggregate mode from explicit config or response content type', () => {
		expect(
			resolveHttpStreamingMode({
				explicitMode: 'aggregate',
				isDeclaredStreamDefinition: true,
				responseContentType: 'text/event-stream',
			}),
		).toBe('aggregate')

		expect(
			resolveHttpStreamingMode({
				isDeclaredStreamDefinition: true,
				responseContentType: 'application/json',
			}),
		).toBe('aggregate')

		expect(
			resolveHttpStreamingMode({
				isDeclaredStreamDefinition: true,
				responseContentType: 'text/event-stream',
			}),
		).toBe('stream')
	})

	it('returns declared final payload for aggregate success', async () => {
		const result = await collectAggregateStreamResult({
			async *[Symbol.asyncIterator]() {
				yield { payload: { frameType: 'chunk', chunk: { partial: 'o' } } }
				yield {
					payload: { frameType: 'complete', final: { message: 'ok', chunks: [{ partial: 'o' }] } },
				}
			},
		} as any)

		expect(result).toEqual({
			status: 'success',
			statusCode: 200,
			payload: { message: 'ok', chunks: [{ partial: 'o' }] },
		})
	})

	it('maps stream error frames to error response', async () => {
		const result = await collectAggregateStreamResult({
			async *[Symbol.asyncIterator]() {
				yield { payload: { frameType: 'error', error: { status: 418, message: 'teapot' } } }
			},
		} as any)

		expect(result).toEqual({
			status: 'error',
			statusCode: 418,
			payload: { status: 418, message: 'teapot' },
		})
	})

	it('treats final payload content as successful aggregate output', async () => {
		const result = await collectAggregateStreamResult({
			async *[Symbol.asyncIterator]() {
				yield {
					payload: {
						frameType: 'complete',
						final: {
							status: 'domain-error',
							message: 'preserved as output',
						},
					},
				}
			},
		} as any)

		expect(result).toEqual({
			status: 'success',
			statusCode: 200,
			payload: {
				status: 'domain-error',
				message: 'preserved as output',
			},
		})
	})
})
