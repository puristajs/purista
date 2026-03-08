import type { LanguageModel } from 'ai'
import { describe, expect, it, vi } from 'vitest'

import { AiSdkProvider } from './AiSdkProvider.js'

const generateTextMock = vi.fn()
const generateObjectMock = vi.fn()
const streamTextMock = vi.fn()
const embedMock = vi.fn()
const embedManyMock = vi.fn()
const rerankMock = vi.fn()
const wrapLanguageModelMock = vi.fn()

vi.mock('ai', () => ({
	generateText: (...args: unknown[]) => generateTextMock(...args),
	generateObject: (...args: unknown[]) => generateObjectMock(...args),
	streamText: (...args: unknown[]) => streamTextMock(...args),
	embed: (...args: unknown[]) => embedMock(...args),
	embedMany: (...args: unknown[]) => embedManyMock(...args),
	rerank: (...args: unknown[]) => rerankMock(...args),
	wrapLanguageModel: (...args: unknown[]) => wrapLanguageModelMock(...args),
}))

const mockModel = {} as LanguageModel

describe('AiSdkProvider', () => {
	it('wraps language model when middleware is configured', () => {
		wrapLanguageModelMock.mockReturnValueOnce(mockModel)
		void new AiSdkProvider({
			model: mockModel,
			middleware: {} as any,
		})
		expect(wrapLanguageModelMock).toHaveBeenCalledOnce()
	})

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
			warnings: [{ type: 'unsupported-setting', setting: 'temperature' }],
		})

		const provider = new AiSdkProvider({ model: mockModel })
		const result = await provider.generate({ prompt: 'test' })
		expect(result.output).toBe('hello')
		expect(result.reasoningText).toBeUndefined()
		expect(result.tokens).toEqual({
			prompt: 11,
			completion: 7,
		})
		expect(result.metadata?.warnings).toEqual([{ type: 'unsupported-setting', setting: 'temperature' }])
		expect(provider.capabilities).toMatchObject({
			text: true,
			stream: true,
			json: true,
			embedding: false,
			rerank: false,
		})
	})

	it('streams text deltas and resolves final usage', async () => {
		streamTextMock.mockReturnValueOnce({
			fullStream: (async function* () {
				yield { type: 'text-delta', text: 'Hello ' }
				yield { type: 'reasoning-delta', delta: 'thinking...' }
				yield { type: 'text-delta', text: 'world' }
				yield { type: 'finish', finishReason: 'stop', totalUsage: { inputTokens: 8, outputTokens: 4 } }
			})(),
			usage: Promise.resolve({ inputTokens: 8, outputTokens: 4 }),
			text: Promise.resolve('Hello world'),
			request: Promise.resolve({ id: 'request' }),
			response: Promise.resolve({ id: 'response' }),
			providerMetadata: Promise.resolve({ provider: 'mock' }),
			warnings: Promise.resolve([{ type: 'other', message: 'stream warning' }]),
		})

		const provider = new AiSdkProvider({ model: mockModel })
		const stream = provider.stream({ prompt: 'test stream' })
		const deltas: string[] = []
		const reasoning: string[] = []
		for await (const chunk of stream) {
			if (chunk.type === 'text-delta') {
				deltas.push(chunk.textDelta)
			}
			if (chunk.type === 'reasoning-delta') {
				reasoning.push(chunk.reasoningDelta)
			}
		}
		expect(deltas.join('')).toBe('Hello world')
		expect(reasoning.join('')).toBe('thinking...')
		const final = await stream.final()
		expect(final.output).toBe('Hello world')
		expect(final.tokens).toEqual({
			prompt: 8,
			completion: 4,
		})
		expect(final.metadata?.warnings).toEqual([{ type: 'other', message: 'stream warning' }])
	})

	it('supports structured json generation', async () => {
		generateObjectMock.mockResolvedValueOnce({
			object: { urgency: 'low' },
			reasoningText: 'reasoning',
			usage: {
				inputTokens: 3,
				outputTokens: 2,
			},
			request: { id: 'request' },
			response: { id: 'response' },
			providerMetadata: { provider: 'mock' },
		})

		const provider = new AiSdkProvider({ model: mockModel })
		const result = await provider.generateJson<{ urgency: string }>({
			prompt: 'classify',
		})
		expect(result.data.urgency).toBe('low')
		expect(result.reasoningText).toBe('reasoning')
		expect(result.text).toContain('"urgency"')
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
			json: true,
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

	it('supports metadata overrides and no-schema JSON generation fallback', async () => {
		generateTextMock.mockResolvedValueOnce({
			text: 'override-ok',
			usage: { inputTokens: 2, outputTokens: 1 },
			request: { id: 'request' },
			response: { id: 'response' },
			providerMetadata: {},
		})
		generateObjectMock.mockResolvedValueOnce({
			object: { route: 'support' },
			reasoning: [{ text: 'chain ' }, { text: 'of thought' }],
			usage: { inputTokens: 4, outputTokens: 2 },
			request: { id: 'request' },
			response: { id: 'response' },
			providerMetadata: {},
		})

		const provider = new AiSdkProvider({
			model: mockModel,
			systemPrompt: 'system',
			defaults: { temperature: 0.2 },
		})

		await provider.generate({
			prompt: 'hello',
			context: 'ctx',
			metadata: {
				aiSdk: {
					generate: {
						temperature: 0.4,
					},
				},
			},
		})
		expect(generateTextMock).toHaveBeenCalledWith(
			expect.objectContaining({
				temperature: 0.4,
				system: 'system\n\nctx',
			}),
		)

		const jsonResult = await provider.generateJson({
			prompt: 'route this',
			metadata: {
				aiSdk: {
					generateJson: {
						temperature: 0,
					},
				},
			},
		})
		expect(generateObjectMock).toHaveBeenCalledWith(
			expect.objectContaining({
				output: 'no-schema',
				temperature: 0,
			}),
		)
		expect(jsonResult.reasoningText).toBe('chain of thought')
	})

	it('preserves top-level aiSdk options when aiSdk.generate is present', async () => {
		generateTextMock.mockResolvedValueOnce({
			text: 'with-tools',
			usage: { inputTokens: 1, outputTokens: 1 },
			request: { id: 'request' },
			response: { id: 'response' },
			providerMetadata: {},
		})

		const provider = new AiSdkProvider({ model: mockModel })
		const tools = { writeSpecFile: { description: 'writes spec', inputSchema: {}, execute: vi.fn() } }

		await provider.generate({
			prompt: 'apply updates',
			metadata: {
				aiSdk: {
					tools,
					toolChoice: 'required',
					maxSteps: 20,
					generate: {
						temperature: 0.1,
					},
				},
			},
		})

		expect(generateTextMock).toHaveBeenCalledWith(
			expect.objectContaining({
				tools,
				toolChoice: 'required',
				maxSteps: 20,
				temperature: 0.1,
			}),
		)
	})

	it('throws when embedding or reranking models are missing', async () => {
		const provider = new AiSdkProvider({ model: mockModel })

		await expect(provider.embed({ value: 'hello' })).rejects.toThrow(
			'Embedding model is not configured for this provider',
		)
		await expect(provider.embedMany({ values: ['a', 'b'] })).rejects.toThrow(
			'Embedding model is not configured for this provider',
		)
		await expect(provider.rerank({ query: 'q', documents: ['a', 'b'] })).rejects.toThrow(
			'Reranking model is not configured for this provider',
		)
	})
})
