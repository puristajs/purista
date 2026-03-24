import { HandledError, StatusCode, UnhandledError } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'

import type { AgentProtocolEnvelope } from '../protocol/types.js'
import { invokeAgent } from './invokeAgent.js'

describe('invokeAgent', () => {
	it('opens an agent stream by default and returns collected envelopes', async () => {
		const envelopes = [{ frame: { kind: 'message', content: 'hi', role: 'assistant' } }] as AgentProtocolEnvelope[]
		const openStream = vi.fn().mockResolvedValue({
			sessionId: 'stream-1',
			cancel: vi.fn(),
			async *[Symbol.asyncIterator]() {
				yield { payload: { frameType: 'chunk', sequence: 1, chunk: envelopes[0] } }
				yield { payload: { frameType: 'complete', sequence: 2, final: envelopes } }
			},
		})
		const eventBridge = {
			instanceId: 'instance-1',
			openStream,
			invoke: vi.fn(),
		} as any

		const result = await invokeAgent({
			eventBridge,
			agentName: 'supportAgent',
			agentVersion: '1',
			payload: { prompt: 'hello' },
			parameter: { locale: 'en' },
		})

		expect(result).toEqual(envelopes)
		expect(openStream).toHaveBeenCalledTimes(1)
		const message = openStream.mock.calls[0][0]
		expect(message.receiver).toEqual({ serviceName: 'supportAgent', serviceVersion: '1', serviceTarget: 'run' })
		expect(message.payload).toEqual({ frameType: 'open', payload: { prompt: 'hello' }, parameter: { locale: 'en' } })
	})

	it('reuses the provided trace id for child-agent invocation', async () => {
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockResolvedValue({
				sessionId: 'stream-1',
				cancel: vi.fn(),
				async *[Symbol.asyncIterator]() {
					yield { payload: { frameType: 'complete', sequence: 1, final: [] } }
				},
			}),
			invoke: vi.fn(),
		} as any

		await invokeAgent({
			eventBridge,
			agentName: 'supportAgent',
			agentVersion: '1',
			payload: { prompt: 'hello' },
			traceId: 'trace-parent-1',
		})

		expect(eventBridge.openStream.mock.calls[0][0].traceId).toBe('trace-parent-1')
	})

	it('streams envelopes incrementally when a stream responder is provided', async () => {
		const envelopes = [
			{ frame: { kind: 'message', content: 'one', role: 'assistant' } },
			{ frame: { kind: 'message', content: 'two', role: 'assistant' } },
		] as AgentProtocolEnvelope[]
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockResolvedValue({
				sessionId: 'stream-1',
				cancel: vi.fn(),
				async *[Symbol.asyncIterator]() {
					yield { payload: { frameType: 'chunk', sequence: 1, chunk: envelopes[0] } }
					yield { payload: { frameType: 'chunk', sequence: 2, chunk: envelopes[1] } }
					yield { payload: { frameType: 'complete', sequence: 3, final: envelopes } }
				},
			}),
			invoke: vi.fn(),
		} as any

		const onFrame = vi.fn()
		const onComplete = vi.fn()
		const onError = vi.fn()

		await invokeAgent({
			eventBridge,
			agentName: 'supportAgent',
			agentVersion: '1',
			payload: { prompt: 'stream' },
			stream: { onFrame, onComplete, onError },
		})

		expect(onFrame).toHaveBeenCalledTimes(2)
		expect(onComplete).toHaveBeenCalledTimes(1)
		expect(onError).not.toHaveBeenCalled()
	})

	it('awaits async stream responders before completing the invocation', async () => {
		const callOrder: string[] = []
		const envelopes = [
			{ frame: { kind: 'message', content: 'final', role: 'assistant', final: true } },
		] as AgentProtocolEnvelope[]
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockResolvedValue({
				sessionId: 'stream-1',
				cancel: vi.fn(),
				async *[Symbol.asyncIterator]() {
					yield { payload: { frameType: 'chunk', sequence: 1, chunk: envelopes[0] } }
					yield { payload: { frameType: 'complete', sequence: 2, final: envelopes } }
				},
			}),
			invoke: vi.fn(),
		} as any

		await invokeAgent({
			eventBridge,
			agentName: 'supportAgent',
			agentVersion: '1',
			payload: { prompt: 'stream' },
			stream: {
				onFrame: async envelope => {
					await new Promise(resolve => setTimeout(resolve, 5))
					callOrder.push(`frame:${envelope.frame.kind}`)
				},
				onComplete: async () => {
					callOrder.push('complete')
				},
				onError: async () => {
					callOrder.push('error')
				},
			},
		})

		expect(callOrder).toEqual(['frame:message', 'complete'])
	})

	it('falls back to command invoke when stream is unavailable', async () => {
		const envelopes = [
			{ frame: { kind: 'message', content: 'fallback', role: 'assistant' } },
		] as AgentProtocolEnvelope[]
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockRejectedValue(new UnhandledError(StatusCode.NotImplemented, 'stream unavailable')),
			invoke: vi.fn().mockResolvedValue(envelopes),
		} as any

		const result = await invokeAgent({
			eventBridge,
			agentName: 'supportAgent',
			agentVersion: '1',
			payload: { prompt: 'hello' },
		})

		expect(result).toEqual(envelopes)
		expect(eventBridge.openStream).toHaveBeenCalledTimes(1)
		expect(eventBridge.invoke).toHaveBeenCalledTimes(1)
	})

	it('uses final envelopes when stream completes without chunk frames', async () => {
		const envelopes = [
			{ frame: { kind: 'message', content: 'final-only', role: 'assistant' } },
		] as AgentProtocolEnvelope[]
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockResolvedValue({
				sessionId: 'stream-1',
				cancel: vi.fn(),
				async *[Symbol.asyncIterator]() {
					yield { payload: { frameType: 'complete', sequence: 1, final: envelopes } }
				},
			}),
			invoke: vi.fn(),
		} as any

		const onFrame = vi.fn()
		const onComplete = vi.fn()
		const onError = vi.fn()

		const result = await invokeAgent({
			eventBridge,
			agentName: 'supportAgent',
			agentVersion: '1',
			payload: { prompt: 'hello' },
			stream: { onFrame, onComplete, onError },
		})

		expect(result).toEqual(envelopes)
		expect(onFrame).toHaveBeenCalledTimes(1)
		expect(onComplete).toHaveBeenCalledTimes(1)
		expect(onError).not.toHaveBeenCalled()
	})

	it('merges completion envelopes even when chunk frames were already streamed', async () => {
		const statusEnvelope = {
			frame: { kind: 'artifact', artifactId: 'status', mimeType: 'application/json', content: '{}' },
		} as AgentProtocolEnvelope
		const finalMessageEnvelope = {
			frame: { kind: 'message', content: '{"ok":true}', role: 'assistant', final: true },
		} as AgentProtocolEnvelope
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockResolvedValue({
				sessionId: 'stream-1',
				cancel: vi.fn(),
				async *[Symbol.asyncIterator]() {
					yield { payload: { frameType: 'chunk', sequence: 1, chunk: statusEnvelope } }
					yield {
						payload: {
							frameType: 'complete',
							sequence: 2,
							final: [statusEnvelope, finalMessageEnvelope],
						},
					}
				},
			}),
			invoke: vi.fn(),
		} as any

		const onFrame = vi.fn()
		const result = await invokeAgent({
			eventBridge,
			agentName: 'supportAgent',
			agentVersion: '1',
			payload: { prompt: 'hello' },
			stream: { onFrame, onComplete: vi.fn(), onError: vi.fn() },
		})

		expect(result).toEqual([statusEnvelope, finalMessageEnvelope])
		expect(onFrame).toHaveBeenCalledTimes(2)
	})

	it('throws stream error frames as UnhandledError', async () => {
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockResolvedValue({
				sessionId: 'stream-1',
				cancel: vi.fn(),
				async *[Symbol.asyncIterator]() {
					yield { payload: { frameType: 'error', sequence: 1, error: { message: 'stream broke' } } }
				},
			}),
			invoke: vi.fn(),
		} as any

		const onError = vi.fn()

		await expect(
			invokeAgent({
				eventBridge,
				agentName: 'supportAgent',
				agentVersion: '1',
				payload: { prompt: 'hello' },
				stream: { onFrame: vi.fn(), onComplete: vi.fn(), onError },
			}),
		).rejects.toThrow('stream broke')
		expect(onError).toHaveBeenCalledTimes(1)
	})

	it('throws when agent returns protocol error envelope in stream chunks', async () => {
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockResolvedValue({
				sessionId: 'stream-1',
				cancel: vi.fn(),
				async *[Symbol.asyncIterator]() {
					yield {
						payload: {
							frameType: 'chunk',
							sequence: 1,
							chunk: {
								frame: {
									kind: 'error',
									code: 'SpecWriteFailed',
									message: 'No spec files were changed',
									handled: true,
								},
							},
						},
					}
				},
			}),
			invoke: vi.fn(),
		} as any

		await expect(
			invokeAgent({
				eventBridge,
				agentName: 'supportAgent',
				agentVersion: '1',
				payload: { prompt: 'hello' },
			}),
		).rejects.toBeInstanceOf(HandledError)
	})

	it('throws when fallback invoke returns protocol error envelope', async () => {
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockRejectedValue(new UnhandledError(StatusCode.NotImplemented, 'stream unavailable')),
			invoke: vi.fn().mockResolvedValue([
				{
					frame: {
						kind: 'error',
						code: 'SubAgentFailed',
						message: 'Sub-agent failed',
						handled: false,
					},
				},
			]),
		} as any

		await expect(
			invokeAgent({
				eventBridge,
				agentName: 'supportAgent',
				agentVersion: '1',
				payload: { prompt: 'hello' },
			}),
		).rejects.toThrow('Sub-agent failed')
	})

	it('keeps unhandled protocol error envelopes as UnhandledError', async () => {
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockRejectedValue(new UnhandledError(StatusCode.NotImplemented, 'stream unavailable')),
			invoke: vi.fn().mockResolvedValue([
				{
					frame: {
						kind: 'error',
						code: 'UnhandledError',
						message: 'Sub-agent crashed',
						handled: false,
					},
				},
			]),
		} as any

		await expect(
			invokeAgent({
				eventBridge,
				agentName: 'supportAgent',
				agentVersion: '1',
				payload: { prompt: 'hello' },
			}),
		).rejects.toBeInstanceOf(UnhandledError)
	})

	it('allows protocol error envelopes when failOnErrorFrame is false', async () => {
		const envelopes = [
			{
				frame: {
					kind: 'error',
					code: 'ExpectedDomainError',
					message: 'domain warning',
					handled: true,
				},
			},
		] as AgentProtocolEnvelope[]
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockRejectedValue(new UnhandledError(StatusCode.NotImplemented, 'stream unavailable')),
			invoke: vi.fn().mockResolvedValue(envelopes),
		} as any

		const result = await invokeAgent({
			eventBridge,
			agentName: 'supportAgent',
			agentVersion: '1',
			payload: { prompt: 'hello' },
			failOnErrorFrame: false,
		})

		expect(result).toEqual(envelopes)
	})

	it('propagates fallback invoke failure to stream responder', async () => {
		const fallbackError = new Error('fallback invoke failed')
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockRejectedValue(new UnhandledError(StatusCode.NotImplemented, 'stream unavailable')),
			invoke: vi.fn().mockRejectedValue(fallbackError),
		} as any

		const onError = vi.fn()
		await expect(
			invokeAgent({
				eventBridge,
				agentName: 'supportAgent',
				agentVersion: '1',
				payload: { prompt: 'hello' },
				stream: { onFrame: vi.fn(), onComplete: vi.fn(), onError },
			}),
		).rejects.toThrow('fallback invoke failed')
		expect(onError).toHaveBeenCalledWith(fallbackError)
	})

	it('injects sessionId into object payloads when provided', async () => {
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockRejectedValue(new UnhandledError(StatusCode.NotImplemented, 'stream unavailable')),
			invoke: vi.fn().mockResolvedValue([]),
		} as any

		await invokeAgent({
			eventBridge,
			agentName: 'supportAgent',
			agentVersion: '1',
			payload: { prompt: 'hello' },
			sessionId: 'chat-123',
		})

		const message = eventBridge.invoke.mock.calls[0][0]
		expect(message.payload).toEqual({
			payload: { prompt: 'hello', sessionId: 'chat-123' },
			parameter: {},
		})
	})

	it('does not override payload sessionId when already present', async () => {
		const eventBridge = {
			instanceId: 'instance-1',
			openStream: vi.fn().mockRejectedValue(new UnhandledError(StatusCode.NotImplemented, 'stream unavailable')),
			invoke: vi.fn().mockResolvedValue([]),
		} as any

		await invokeAgent({
			eventBridge,
			agentName: 'supportAgent',
			agentVersion: '1',
			payload: { prompt: 'hello', sessionId: 'existing' },
			sessionId: 'chat-123',
		})

		const message = eventBridge.invoke.mock.calls[0][0]
		expect(message.payload).toEqual({
			payload: { prompt: 'hello', sessionId: 'existing' },
			parameter: {},
		})
	})
})
