import { describe, expect, it, vi } from 'vitest'

import type { AgentProtocolEnvelope } from '../protocol/types.js'
import { invokeAgent } from './invokeAgent.js'

describe('invokeAgent', () => {
	it('invokes the agent command and returns envelopes', async () => {
		const envelopes = [{ frame: { kind: 'message', content: 'hi', role: 'assistant' } }] as AgentProtocolEnvelope[]
		const invoke = vi.fn().mockResolvedValue(envelopes)
		const eventBridge = {
			instanceId: 'instance-1',
			invoke,
		} as any

		const result = await invokeAgent({
			eventBridge,
			agentName: 'supportAgent',
			agentVersion: '1',
			payload: { prompt: 'hello' },
			parameter: { locale: 'en' },
		})

		expect(result).toEqual(envelopes)
		expect(invoke).toHaveBeenCalledTimes(1)
		const message = invoke.mock.calls[0][0]
		expect(message.receiver).toEqual({ serviceName: 'supportAgent', serviceVersion: '1', serviceTarget: 'run' })
		expect(message.payload).toEqual({ payload: { prompt: 'hello' }, parameter: { locale: 'en' } })
	})

	it('streams all envelopes when a stream responder is provided', async () => {
		const envelopes = [
			{ frame: { kind: 'message', content: 'one', role: 'assistant' } },
			{ frame: { kind: 'message', content: 'two', role: 'assistant' } },
		] as AgentProtocolEnvelope[]
		const eventBridge = {
			instanceId: 'instance-1',
			invoke: vi.fn().mockResolvedValue(envelopes),
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

	it('injects sessionId into object payloads when provided', async () => {
		const eventBridge = {
			instanceId: 'instance-1',
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
