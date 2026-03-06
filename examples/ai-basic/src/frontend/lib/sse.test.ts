import { describe, expect, it } from 'vitest'

import { parseSseChunk } from './sse'

describe('parseSseChunk', () => {
	it('parses event and json data', () => {
		const payload = parseSseChunk(
			'event: chunk\ndata: {"frameType":"chunk","chunk":{"messageId":"m1","version":"purista.ai/1.0","timestamp":"2026-03-04T00:00:00.000Z","frame":{"kind":"message","content":"hello"}}}\n',
		)

		expect(payload.event).toBe('chunk')
		expect(payload.parsed?.frameType).toBe('chunk')
	})

	it('keeps invalid payload as raw data', () => {
		const payload = parseSseChunk('event: chunk\ndata: not-json\n')
		expect(payload.event).toBe('chunk')
		expect(payload.parsed).toBeUndefined()
		expect(payload.raw).toBe('not-json')
	})
})
