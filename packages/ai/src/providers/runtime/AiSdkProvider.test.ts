import type { LanguageModel } from 'ai'
import { describe, expect, it, vi } from 'vitest'

import { AiSdkProvider } from './AiSdkProvider.js'

const generateTextMock = vi.fn()
const streamTextMock = vi.fn()
const embedMock = vi.fn()
const embedManyMock = vi.fn()
const rerankMock = vi.fn()

vi.mock('ai', () => ({
	generateText: (...args: unknown[]) => generateTextMock(...args),
	streamText: (...args: unknown[]) => streamTextMock(...args),
	embed: (...args: unknown[]) => embedMock(...args),
	embedMany: (...args: unknown[]) => embedManyMock(...args),
	rerank: (...args: unknown[]) => rerankMock(...args),
}))

const mockModel = {} as LanguageModel

describe('AiSdkProvider', () => {
	it('maps generateText responses into provider response', async () => {
		generateTextMock.mockResolvedValueOnce({
			text: 'hello',
			usage: {
				inputTokens: 11,
				outputTokens: 7,
			},
			request: { id: 'request' },
			response: { id: 'response' },
			providerMetadata: { provider: 'mock' },
		})

		const provider = new AiSdkProvider({ model: mockModel })
		const result = await provider.generate({ prompt: 'test' })
		expect(result.output).toBe('hello')
		expect(result.tokens).toEqual({
			prompt: 11,
			completion: 7,
		})
		expect(provider.capabilities).toMatchObject({
			text: true,
			stream: true,
			embedding: false,
			rerank: false,
		})
	})

	it('streams text deltas and resolves final usage', async () => {
		streamTextMock.mockReturnValueOnce({
			fullStream: (async function* () {
				yield { type: 'text-delta', text: 'Hello ' }
				yield { type: 'text-delta', text: 'world' }
				yield { type: 'finish', finishReason: 'stop', totalUsage: { inputTokens: 8, outputTokens: 4 } }
			})(),
			usage: Promise.resolve({ inputTokens: 8, outputTokens: 4 }),
			text: Promise.resolve('Hello world'),
			request: Promise.resolve({ id: 'request' }),
			response: Promise.resolve({ id: 'response' }),
			providerMetadata: Promise.resolve({ provider: 'mock' }),
		})

		const provider = new AiSdkProvider({ model: mockModel })
		const stream = provider.stream({ prompt: 'test stream' })
		const deltas: string[] = []
		for await (const chunk of stream) {
			if (chunk.type === 'text-delta') {
				deltas.push(chunk.textDelta)
			}
		}
		expect(deltas.join('')).toBe('Hello world')
		const final = await stream.final()
		expect(final.output).toBe('Hello world')
		expect(final.tokens).toEqual({
			prompt: 8,
			completion: 4,
		})
	})

	it('supports embedding and reranking when models are configured', async () => {
		embedMock.mockResolvedValueOnce({
			embedding: [0.1, 0.2, 0.3],
			usage: { tokens: 12 },
			response: { id: 'embed-response' },
			providerMetadata: { provider: 'mock' },
		})
		embedManyMock.mockResolvedValueOnce({
			embeddings: [
				[0.1, 0.2],
				[0.3, 0.4],
			],
			usage: { tokens: 20 },
			responses: [{ id: 'embed-many-response' }],
			providerMetadata: { provider: 'mock' },
		})
		rerankMock.mockResolvedValueOnce({
			ranking: [
				{ originalIndex: 1, score: 0.95, document: 'B' },
				{ originalIndex: 0, score: 0.4, document: 'A' },
			],
			rerankedDocuments: ['B', 'A'],
			response: { id: 'rerank-response' },
			providerMetadata: { provider: 'mock' },
		})

		const provider = new AiSdkProvider({
			model: mockModel,
			embeddingModel: {} as any,
			rerankingModel: {} as any,
		})
		expect(provider.capabilities).toMatchObject({
			text: true,
			stream: true,
			embedding: true,
			rerank: true,
		})

		const single = await provider.embed({ value: 'hello' })
		expect(single.embedding).toEqual([0.1, 0.2, 0.3])
		expect(single.usage?.tokens).toBe(12)

		const batch = await provider.embedMany({ values: ['A', 'B'] })
		expect(batch.embeddings).toHaveLength(2)
		expect(batch.usage?.tokens).toBe(20)

		const ranked = await provider.rerank({
			query: 'best',
			documents: ['A', 'B'],
			topN: 2,
		})
		expect(ranked.rerankedDocuments).toEqual(['B', 'A'])
		expect(ranked.ranking[0]?.score).toBe(0.95)
	})
})
