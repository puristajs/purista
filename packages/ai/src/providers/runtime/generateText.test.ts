import { UnhandledError } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import { generateText } from './generateText.js'
import type { ModelProvider } from './ModelProvider.js'

describe('generateText', () => {
	it('prefers stream and emits callbacks', async () => {
		const onReasoning = vi.fn()
		const onTextDelta = vi.fn()
		const model: Pick<ModelProvider, 'stream' | 'generate'> = {
			stream: () => ({
				async final() {
					return {
						output: 'hello world',
						reasoningText: 'done',
					}
				},
				async *[Symbol.asyncIterator]() {
					yield { type: 'reasoning-delta' as const, reasoningDelta: 'thinking' }
					yield { type: 'text-delta' as const, textDelta: 'hello ' }
					yield { type: 'text-delta' as const, textDelta: 'world' }
				},
			}),
		}

		const result = await generateText({
			model,
			request: { prompt: 'x' },
			onReasoning,
			onTextDelta,
		})
		expect(result).toBe('hello world')
		expect(onReasoning).toHaveBeenCalled()
		expect(onTextDelta).toHaveBeenCalledTimes(2)
	})

	it('falls back to generate when stream is missing', async () => {
		const model: Pick<ModelProvider, 'stream' | 'generate'> = {
			generate: async () => ({
				output: 'fallback',
			}),
		}
		const result = await generateText({
			model,
			request: { prompt: 'x' },
		})
		expect(result).toBe('fallback')
	})

	it('throws UnhandledError when neither stream nor generate is available', async () => {
		const model: Pick<ModelProvider, 'stream' | 'generate'> = {}
		await expect(
			generateText({
				model,
				request: { prompt: 'x' },
			}),
		).rejects.toBeInstanceOf(UnhandledError)
	})
})
