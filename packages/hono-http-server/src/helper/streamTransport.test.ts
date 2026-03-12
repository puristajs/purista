import { describe, expect, it } from 'vitest'

import {
	collectAggregateStreamResult,
	encodeProtocolSseEvent,
	isAgentEnvelopeLike,
	isProtocolSseEvent,
	isStreamErrorPayload,
	isTransportControlFrame,
	resolveHttpStreamingMode,
} from './streamTransport.js'

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

	it('detects transport control frames', () => {
		expect(isTransportControlFrame('open')).toBe(true)
		expect(isTransportControlFrame('complete')).toBe(true)
		expect(isTransportControlFrame('chunk')).toBe(false)
	})

	it('detects envelope-like chunks', () => {
		expect(isAgentEnvelopeLike({ version: 'purista.ai/1.0', frame: { kind: 'message' } })).toBe(true)
		expect(isAgentEnvelopeLike({ frame: { kind: 'message' } })).toBe(false)
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
				yield { payload: { frameType: 'chunk', chunk: { version: 'purista.ai/1.0', frame: { kind: 'message' } } } }
				yield { payload: { frameType: 'complete', final: { message: 'ok', envelopes: [{ frame: { kind: 'message' } }] } } }
			},
		} as any)

		expect(result).toEqual({
			status: 'success',
			statusCode: 200,
			payload: { message: 'ok', envelopes: [{ frame: { kind: 'message' } }] },
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

	it('maps final error envelope to 500 while preserving final payload', async () => {
		const result = await collectAggregateStreamResult({
			async *[Symbol.asyncIterator]() {
				yield {
					payload: {
						frameType: 'complete',
						final: {
							envelopes: [
								{
									version: 'purista.ai/1.0',
									frame: { kind: 'error', message: 'failed' },
								},
							],
						},
					},
				}
			},
		} as any)

		expect(result).toEqual({
			status: 'error',
			statusCode: 500,
			payload: {
				envelopes: [
					{
						version: 'purista.ai/1.0',
						frame: { kind: 'error', message: 'failed' },
					},
				],
			},
		})
	})
})
