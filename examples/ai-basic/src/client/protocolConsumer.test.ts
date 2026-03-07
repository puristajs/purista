import { describe, expect, it } from 'vitest'

import {
	consumeProtocolSseChunk,
	createProtocolConsumerState,
	parseEnvelopeJson,
	parseSseChunk,
	toChatTranscript,
	toReferenceInterop,
} from './protocolConsumer.js'

describe('protocolConsumer', () => {
	it('parses chunk and complete SSE events into envelopes', () => {
		const state = createProtocolConsumerState()
		const sseChunk = [
			'event: chunk',
			'data: {"chunk":[{"version":"purista.ai/1.0","messageId":"m1","conversationId":"c1","timestamp":"2026-03-04T10:00:00.000Z","actor":{"service":"supportAgent"},"frame":{"kind":"message","role":"assistant","content":"hello","partial":true}}]}',
			'',
			'event: complete',
			'data: {"final":[{"version":"purista.ai/1.0","messageId":"m2","conversationId":"c1","timestamp":"2026-03-04T10:00:01.000Z","actor":{"service":"supportAgent"},"frame":{"kind":"message","role":"assistant","content":"final","final":true}}]}',
			'',
			'',
		].join('\n')

		const consumed = consumeProtocolSseChunk(state, sseChunk)
		expect(consumed.newEnvelopes.length).toBe(2)
		expect(consumed.state.envelopes.length).toBe(2)
		expect(consumed.state.buffer).toBe('')
	})

	it('keeps trailing incomplete SSE data in buffer', () => {
		const partial = ['event: chunk', 'data: {"chunk":[]}'].join('\n')
		const parsed = parseSseChunk('', partial)
		expect(parsed.events).toEqual([])
		expect(parsed.rest).toContain('event: chunk')
	})

	it('creates transcript and reference interoperability output', () => {
		const envelopes = parseEnvelopeJson(
			JSON.stringify([
				{
					version: 'purista.ai/1.0',
					messageId: 'm3',
					conversationId: 'c2',
					timestamp: '2026-03-04T10:00:02.000Z',
					actor: { service: 'supportAgent', version: '1', agent: 'supportAgent' },
					frame: { kind: 'message', role: 'assistant', content: 'hi there', final: true },
				},
			]),
		)

		const transcript = toChatTranscript(envelopes)
		const interop = toReferenceInterop(envelopes)

		expect(transcript).toEqual([{ role: 'assistant', text: 'hi there' }])
		expect(interop.agent2agent[0]?.threadId).toBe('c2')
		expect(interop.mcpToolResult.content.length).toBeGreaterThan(0)
	})
})
