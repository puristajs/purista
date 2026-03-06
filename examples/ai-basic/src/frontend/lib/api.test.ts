import { afterEach, describe, expect, it, vi } from 'vitest'

import { getMcpTools, loadConversation, streamSupportAgent } from './api'

describe('loadConversation', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('calls command-owned hydration endpoint with session id', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			json: async () => ({ sessionId: 's1', envelopes: [] }),
		} as Response)

		const result = await loadConversation('s1')

		expect(fetchMock).toHaveBeenCalledWith('/api/v1/support/conversation', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ sessionId: 's1' }),
		})
		expect(result.sessionId).toBe('s1')
	})
})

describe('streamSupportAgent', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('does not duplicate envelopes when complete payload repeats chunk data', async () => {
		const body = [
			'event: start',
			'data: {"frameType":"start","sequence":0}',
			'',
			'event: chunk',
			'data: {"frameType":"chunk","sequence":1,"chunk":{"version":"purista.ai/1.0","messageId":"m1","timestamp":"2026-03-04T00:00:00.000Z","frame":{"kind":"message","content":"hello"}}}',
			'',
			'event: complete',
			'data: {"frameType":"complete","sequence":2,"final":{"message":"hello","envelopes":[{"version":"purista.ai/1.0","messageId":"m1","timestamp":"2026-03-04T00:00:00.000Z","frame":{"kind":"message","content":"hello"}}]}}',
			'',
		].join('\n')

		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(body, {
				status: 200,
				headers: { 'content-type': 'text/event-stream' },
			}),
		)

		const envelopeIds: string[] = []
		await streamSupportAgent(
			{ prompt: 'hello' },
			{
				onEnvelope: envelope => {
					envelopeIds.push(envelope.messageId)
				},
				onPayload: () => undefined,
				onComplete: () => undefined,
				onError: () => undefined,
			},
		)

		expect(envelopeIds).toEqual(['m1'])
	})
})

describe('getMcpTools', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('calls the MCP tool descriptor endpoint', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: true,
			json: async () => ({ tools: [] }),
		} as Response)
		await getMcpTools()
		expect(fetchMock).toHaveBeenCalledWith('/api/v1/support/mcp/tools', {
			method: 'GET',
			headers: { accept: 'application/json' },
		})
	})
})
