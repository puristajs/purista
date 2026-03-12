import { describe, expect, it, vi } from 'vitest'
import { collectStreamText, normalizeReasoningDelta } from './streamNormalization.js'

describe('streamNormalization', () => {
	it('normalizes reasoning deltas from text and delta fields', () => {
		expect(normalizeReasoningDelta({ text: 'a' })).toBe('a')
		expect(normalizeReasoningDelta({ delta: 'b' })).toBe('b')
		expect(normalizeReasoningDelta({})).toBe('')
	})

	it('collects stream text and forwards callbacks', async () => {
		const onReasoning = vi.fn()
		const onTextDelta = vi.fn()
		const final = await collectStreamText(
			{
				async final() {
					return { output: '', reasoningText: 'done' }
				},
				async *[Symbol.asyncIterator]() {
					yield { type: 'reasoning-delta' as const, reasoningDelta: 'thinking' }
					yield { type: 'text-delta' as const, textDelta: 'hello ' }
					yield { type: 'text-delta' as const, textDelta: 'world' }
				},
			},
			{
				onReasoning,
				onTextDelta,
			},
		)

		expect(final.output).toBe('hello world')
		expect(onReasoning).toHaveBeenCalledTimes(2)
		expect(onTextDelta).toHaveBeenCalledTimes(2)
	})
})
