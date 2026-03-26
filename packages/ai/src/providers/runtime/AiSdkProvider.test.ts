import { StatusCode, UnhandledError } from '@purista/core'
import type { LanguageModel } from 'ai'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { createCommandBinding } from '../../bridge/externalRuntime.js'

import { AiSdkProvider } from './AiSdkProvider.js'

const generateTextMock = vi.fn()
const generateObjectMock = vi.fn()
const streamTextMock = vi.fn()
const streamObjectMock = vi.fn()
const embedMock = vi.fn()
const embedManyMock = vi.fn()
const rerankMock = vi.fn()
const wrapLanguageModelMock = vi.fn()
const toolMock = vi.fn((definition: unknown) => definition)

vi.mock('ai', () => ({
	generateText: (...args: unknown[]) => generateTextMock(...args),
	generateObject: (...args: unknown[]) => generateObjectMock(...args),
	streamText: (...args: unknown[]) => streamTextMock(...args),
	streamObject: (...args: unknown[]) => streamObjectMock(...args),
	embed: (...args: unknown[]) => embedMock(...args),
	embedMany: (...args: unknown[]) => embedManyMock(...args),
	rerank: (...args: unknown[]) => rerankMock(...args),
	wrapLanguageModel: (...args: unknown[]) => wrapLanguageModelMock(...args),
	tool: (...args: unknown[]) => toolMock(...args),
}))

const mockModel = {} as LanguageModel

describe('AiSdkProvider', () => {
	beforeEach(() => {
		generateTextMock.mockReset()
		generateObjectMock.mockReset()
		streamTextMock.mockReset()
		streamObjectMock.mockReset()
		embedMock.mockReset()
		embedManyMock.mockReset()
		rerankMock.mockReset()
		wrapLanguageModelMock.mockReset()
		toolMock.mockReset()
		toolMock.mockImplementation(definition => definition)
	})

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

	it('passes multimodal message content through generate calls', async () => {
		generateTextMock.mockResolvedValueOnce({
			text: 'analyzed',
			usage: {
				inputTokens: 20,
				outputTokens: 5,
			},
			request: { id: 'request' },
			response: { id: 'response' },
			providerMetadata: { provider: 'mock' },
		})

		const provider = new AiSdkProvider({ model: mockModel })
		await provider.generate({
			prompt: 'Analyze the uploaded assets',
			input: [
				{
					type: 'image',
					image: new URL('https://example.com/mockup.png'),
					mediaType: 'image/png',
					detail: 'low',
				},
			],
			attachments: [
				{
					attachmentId: 'brief-1',
					mediaType: 'application/pdf',
					filename: 'brief.pdf',
					source: {
						kind: 'url',
						url: 'https://example.com/brief.pdf',
					},
				},
			],
		})

		expect(generateTextMock).toHaveBeenCalledWith(
			expect.objectContaining({
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: 'Analyze the uploaded assets',
							},
							{
								type: 'image',
								image: new URL('https://example.com/mockup.png'),
								mediaType: 'image/png',
								providerOptions: {
									openai: {
										imageDetail: 'low',
									},
								},
							},
							{
								type: 'file',
								data: new URL('https://example.com/brief.pdf'),
								mediaType: 'application/pdf',
								filename: 'brief.pdf',
							},
						],
					},
				],
			}),
		)
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

	it('compiles provider-safe structured json schemas', async () => {
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
			schema: z.object({
				urgency: z.string(),
				settings: z
					.object({
						enabled: z.boolean(),
					})
					.optional(),
			}),
		})
		expect(result.data.urgency).toBe('low')
		expect(result.reasoningText).toBe('reasoning')
		expect(result.text).toContain('"urgency"')
		expect(generateObjectMock).toHaveBeenCalledWith(
			expect.objectContaining({
				schema: expect.objectContaining({
					jsonSchema: expect.anything(),
				}),
			}),
		)
		const callSchema = (
			generateObjectMock.mock.calls[generateObjectMock.mock.calls.length - 1]?.[0] as {
				schema?: { jsonSchema?: Promise<unknown> | unknown }
			}
		).schema
		const compiledJsonSchema = await callSchema?.jsonSchema
		expect(compiledJsonSchema).toMatchObject({
			type: 'object',
			properties: expect.objectContaining({
				settings: expect.objectContaining({
					type: 'object',
					additionalProperties: false,
				}),
			}),
			additionalProperties: false,
		})
		expect(JSON.stringify(compiledJsonSchema)).not.toContain('propertyNames')
	})

	it('passes multimodal messages through structured json generation', async () => {
		generateObjectMock.mockResolvedValueOnce({
			object: { result: 'ok' },
			usage: {
				inputTokens: 4,
				outputTokens: 2,
			},
			request: { id: 'request' },
			response: { id: 'response' },
			providerMetadata: { provider: 'mock' },
		})

		const provider = new AiSdkProvider({ model: mockModel })
		await provider.generateJson({
			prompt: 'Extract the visible fields',
			input: [
				{
					type: 'image',
					image: new URL('https://example.com/form.png'),
					mediaType: 'image/png',
				},
			],
			schema: z.object({
				result: z.string(),
			}),
		})

		expect(generateObjectMock).toHaveBeenCalledWith(
			expect.objectContaining({
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: 'Extract the visible fields',
							},
							{
								type: 'image',
								image: new URL('https://example.com/form.png'),
								mediaType: 'image/png',
							},
						],
					},
				],
			}),
		)
	})

	it('streams provisional object sections before the final structured object', async () => {
		streamObjectMock.mockReturnValueOnce({
			partialObjectStream: (async function* () {
				yield {
					summary: 'Ready to review',
				}
				yield {
					summary: 'Ready to review',
					blockers: ['Missing cancellation rule'],
				}
			})(),
			usage: Promise.resolve({ inputTokens: 9, outputTokens: 3 }),
			object: Promise.resolve({
				summary: 'Ready to review',
				blockers: ['Missing cancellation rule'],
			}),
			request: Promise.resolve({ id: 'request' }),
			response: Promise.resolve({ id: 'response' }),
			providerMetadata: Promise.resolve({ provider: 'mock' }),
			warnings: Promise.resolve([]),
		})

		const provider = new AiSdkProvider({ model: mockModel })
		const stream = provider.streamObject<{
			summary?: string
			blockers?: string[]
		}>({
			prompt: 'Review the current project',
			schema: z.object({
				summary: z.string().optional(),
				blockers: z.array(z.string()).default([]),
			}),
			sections: partial => ({
				summary: partial.summary,
				blockers: partial.blockers,
			}),
		})

		const chunks = []
		for await (const chunk of stream) {
			chunks.push(chunk)
		}

		expect(chunks).toEqual([
			{ type: 'section', section: 'summary', content: 'Ready to review' },
			{
				type: 'section',
				section: 'blockers',
				content: ['Missing cancellation rule'],
			},
			expect.objectContaining({
				type: 'final-object',
				data: {
					summary: 'Ready to review',
					blockers: ['Missing cancellation rule'],
				},
			}),
		])
	})

	it('falls back to generateJson when object streaming is unavailable', async () => {
		streamObjectMock.mockRejectedValueOnce(new Error('no native object stream'))
		generateObjectMock.mockResolvedValueOnce({
			object: { summary: 'Fallback review' },
			usage: {
				inputTokens: 4,
				outputTokens: 2,
			},
			request: { id: 'request' },
			response: { id: 'response' },
			providerMetadata: { provider: 'mock' },
		})

		const provider = new AiSdkProvider({ model: mockModel })
		const stream = provider.streamObject<{ summary?: string }>({
			prompt: 'Review the current project',
			schema: z.object({
				summary: z.string().optional(),
			}),
			sections: partial => ({
				summary: partial.summary,
			}),
		})

		const chunks = []
		for await (const chunk of stream) {
			chunks.push(chunk)
		}

		expect(chunks).toEqual([
			{ type: 'section', section: 'summary', content: 'Fallback review' },
			expect.objectContaining({
				type: 'final-object',
				data: { summary: 'Fallback review' },
			}),
		])
	})

	it('wraps provider structured-output errors as UnhandledError', async () => {
		generateObjectMock.mockRejectedValueOnce(new Error("Invalid schema for response_format 'response'"))

		const provider = new AiSdkProvider({ model: mockModel })
		const result = provider.generateJson({
			prompt: 'classify',
			schema: { type: 'object' },
		})
		await expect(result).rejects.toBeInstanceOf(UnhandledError)
		await expect(result).rejects.toMatchObject({ errorCode: StatusCode.InternalServerError })
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

	it('maps skills, references, and bindings from provider requests into the AI SDK call', async () => {
		generateTextMock.mockResolvedValueOnce({
			text: 'with-runtime-context',
			usage: { inputTokens: 3, outputTokens: 2 },
			request: { id: 'request' },
			response: { id: 'response' },
			providerMetadata: {},
		})

		const provider = new AiSdkProvider({ model: mockModel })
		const binding = createCommandBinding({
			command: {
				serviceName: 'support',
				serviceVersion: '1',
				commandName: 'lookupFaq',
			},
			execute: async () => ({ answer: 'ok' }),
		})

		await provider.generate({
			prompt: 'Customer prompt',
			developerInstruction: 'Use tools before answering.',
			skills: [{ name: 'spec-elicitation', content: 'Ask clarifying questions first.' }],
			references: [{ skillName: 'spec-elicitation', relativePath: 'references/checklist.md', content: 'Checklist' }],
			bindings: [binding],
			metadata: {
				aiSdk: {
					toolChoice: 'required',
				},
			},
		})

		expect(generateTextMock).toHaveBeenCalledWith(
			expect.objectContaining({
				prompt: expect.stringContaining('spec-elicitation'),
				tools: expect.objectContaining({
					support_1_lookupFaq: expect.any(Object),
				}),
				toolChoice: 'required',
				system: expect.arrayContaining([
					expect.objectContaining({
						content: 'Use tools before answering.',
						providerOptions: { openai: { systemMessageMode: 'developer' } },
					}),
				]),
			}),
		)
	})

	it('maps per-call developer instructions to provider system messages in generate/stream/generateJson', async () => {
		generateTextMock.mockResolvedValueOnce({
			text: 'ok',
			usage: { inputTokens: 1, outputTokens: 1 },
			request: { id: 'request' },
			response: { id: 'response' },
			providerMetadata: {},
		})
		streamTextMock.mockReturnValueOnce({
			fullStream: (async function* () {
				yield { type: 'text-delta', text: 'done' }
			})(),
			usage: Promise.resolve({ inputTokens: 2, outputTokens: 1 }),
			text: Promise.resolve('done'),
			request: Promise.resolve({ id: 'stream-request' }),
			response: Promise.resolve({ id: 'stream-response' }),
			providerMetadata: Promise.resolve({}),
		})
		generateObjectMock.mockResolvedValueOnce({
			object: { ok: true },
			usage: { inputTokens: 1, outputTokens: 1 },
			request: { id: 'json-request' },
			response: { id: 'json-response' },
			providerMetadata: {},
		})

		const provider = new AiSdkProvider({ model: mockModel, systemPrompt: 'static-system' })

		await provider.generate({
			prompt: 'hello',
			context: 'ctx',
			developerInstruction: 'always ask for persistence details',
		})
		expect(generateTextMock).toHaveBeenCalledWith(
			expect.objectContaining({
				system: expect.arrayContaining([
					expect.objectContaining({
						role: 'system',
						providerOptions: { openai: { systemMessageMode: 'system' } },
					}),
					expect.objectContaining({
						role: 'system',
						content: 'always ask for persistence details',
						providerOptions: { openai: { systemMessageMode: 'developer' } },
					}),
				]),
			}),
		)

		const stream = provider.stream({
			prompt: 'stream please',
			developerInstruction: ['developer rule 1', 'developer rule 2'],
		})
		for await (const _chunk of stream) {
			// consume stream
		}
		await stream.final()
		expect(streamTextMock).toHaveBeenCalledWith(
			expect.objectContaining({
				system: expect.arrayContaining([
					expect.objectContaining({
						content: 'developer rule 1',
						providerOptions: { openai: { systemMessageMode: 'developer' } },
					}),
					expect.objectContaining({
						content: 'developer rule 2',
						providerOptions: { openai: { systemMessageMode: 'developer' } },
					}),
				]),
			}),
		)

		await provider.generateJson({
			prompt: 'json please',
			developerInstruction: 'developer-json',
		})
		expect(generateObjectMock).toHaveBeenCalledWith(
			expect.objectContaining({
				system: expect.arrayContaining([
					expect.objectContaining({
						content: 'developer-json',
						providerOptions: { openai: { systemMessageMode: 'developer' } },
					}),
				]),
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
