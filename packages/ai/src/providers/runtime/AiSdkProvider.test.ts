import { describe, expect, it, vi } from 'vitest'

import { AiSdkProvider } from './AiSdkProvider.js'

const mockGenerateText = vi.fn()

vi.mock('ai', () => ({
	generateText: (...args: unknown[]) => mockGenerateText(...args),
}))

describe('AiSdkProvider', () => {
	const baseUsage = {
		inputTokens: 10,
		inputTokenDetails: {
			noCacheTokens: undefined,
			cacheReadTokens: undefined,
			cacheWriteTokens: undefined,
		},
		outputTokens: 5,
		outputTokenDetails: {
			textTokens: 5,
			reasoningTokens: undefined,
		},
		totalTokens: 15,
	}

	beforeEach(() => {
		mockGenerateText.mockReset()
		mockGenerateText.mockResolvedValue({
			text: 'response',
			usage: baseUsage,
			request: { model: 'demo' },
			response: { id: 'resp' },
			providerMetadata: { model: 'demo' },
		})
	})

	it('forwards prompt/context and merges defaults', async () => {
		const provider = new AiSdkProvider({
			model: 'openai:',
			systemPrompt: 'You are helpful',
			defaults: { temperature: 0.1 },
		})

		const result = await provider.generate({ prompt: 'Hello', context: 'user context' })

		expect(mockGenerateText).toHaveBeenCalledWith({
			model: 'openai:',
			prompt: 'Hello',
			system: 'You are helpful\n\nuser context',
			temperature: 0.1,
			experimental_telemetry: {
				isEnabled: true,
			},
		})
		expect(result.output).toBe('response')
		expect(result.tokens).toEqual({ prompt: 10, completion: 5 })
	})

	it('accepts per-call overrides via metadata', async () => {
		const provider = new AiSdkProvider({
			model: 'anthropic:claude-3-haiku',
			defaults: { temperature: 0.5 },
		})

		await provider.generate({
			prompt: 'Plan the sprint',
			metadata: { aiSdk: { temperature: 0.2, maxOutputTokens: 256 } },
		})

		expect(mockGenerateText).toHaveBeenLastCalledWith({
			model: 'anthropic:claude-3-haiku',
			prompt: 'Plan the sprint',
			temperature: 0.2,
			maxOutputTokens: 256,
			system: undefined,
			experimental_telemetry: {
				isEnabled: true,
			},
		})
	})
})
