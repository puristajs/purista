import { DefaultEventBridge } from '@purista/core'
import { afterEach, describe, expect, it } from 'vitest'
import { z } from 'zod/v4'

import type { ModelProvider, ProviderRequest } from '../providers/runtime/ModelProvider.js'
import { AgentBuilder } from './AgentBuilder.js'

class DeterministicTextProvider implements ModelProvider {
	readonly name = 'deterministic-text'
	readonly capabilities = { text: true, stream: true }

	async generate(request: ProviderRequest) {
		return {
			output: request.prompt,
			tokens: {
				prompt: request.prompt.length,
				completion: request.prompt.length,
			},
			costUsd: 0,
		}
	}

	stream(request: ProviderRequest) {
		let done = false
		return {
			async final() {
				return {
					output: request.prompt,
					tokens: {
						prompt: request.prompt.length,
						completion: request.prompt.length,
					},
				}
			},
			async *[Symbol.asyncIterator]() {
				if (done) {
					return
				}
				done = true
				yield {
					type: 'text-delta' as const,
					textDelta: request.prompt,
				}
			},
		}
	}
}

class ThisBoundStreamProvider implements ModelProvider {
	readonly name = 'this-bound-stream'
	readonly capabilities = { text: true, stream: true }
	private readonly prefix = 'stream:'

	async generate(request: ProviderRequest) {
		return {
			output: `${this.prefix}${request.prompt}`,
			tokens: {
				prompt: request.prompt.length,
				completion: request.prompt.length,
			},
		}
	}

	stream(request: ProviderRequest) {
		const output = `${this.prefix}${request.prompt}`
		return {
			async final() {
				return {
					output,
					tokens: {
						prompt: request.prompt.length,
						completion: request.prompt.length,
					},
				}
			},
			async *[Symbol.asyncIterator]() {
				yield {
					type: 'text-delta' as const,
					textDelta: output,
				}
			},
		}
	}
}

const bridges: DefaultEventBridge[] = []

afterEach(async () => {
	for (const bridge of bridges.splice(0)) {
		await bridge.destroy()
	}
})

describe('AgentBuilder', () => {
	it('requires a non-empty agent name', () => {
		expect(() => new AgentBuilder({ agentName: '', agentVersion: '1' })).toThrow('Agent name is required')
	})

	it('requires exposeAsHttpEndpoint before setStreamingMode', () => {
		const builder = new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
		expect(() => builder.setStreamingMode('sse')).toThrow(
			'Call exposeAsHttpEndpoint before configuring the streaming mode',
		)
	})

	it('requires non-empty knowledge adapter names', () => {
		expect(() => new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' }).useKnowledgeAdapter('')).toThrow(
			'Knowledge adapter name must not be empty',
		)
	})

	it('supports manifest mutation helpers and requires a handler before build()', () => {
		const payloadSchema = z.object({ prompt: z.string() })
		const parameterSchema = z.object({ locale: z.string().optional() })
		const outputSchema = z.object({ message: z.string() })
		const contextSchema = z.object({ requestId: z.string().optional() })

		const builder = new AgentBuilder({ agentName: 'helperAgent', agentVersion: '1' })
			.setDescription('helper description')
			.useEventBridge('customBridge')
			.useResource('llm', { resourceName: 'model' })
			.useSessionStore({ storeName: 'sessions', maxFrames: 20 })
			.useKnowledgeAdapter('knowledge', { topK: 3 })
			.setRuntime('worker')
			.setModelResource({ resourceName: 'modelResource', variant: 'mini' })
			.setRetryPolicy({ maxAttempts: 2, strategy: 'fixed', delayMs: 100 })
			.setMemory({ storeName: 'memoryStore', maxFrames: 10 })
			.setKnowledge([{ adapterName: 'knowledge2', options: { topK: 1 } }])
			.allowTool({ serviceName: 'ToolService', serviceVersion: '1', commandName: 'run' })
			.setTelemetry({ attributes: { team: 'support' } })
			.setEvaluation({ suite: 'smoke' })
			.addPayloadSchema(payloadSchema)
			.setInputSchema(payloadSchema)
			.addParameterSchema(parameterSchema)
			.addOutputSchema(outputSchema)
			.addContextSchema(contextSchema)
			.setContextSchema(contextSchema)
			.exposeAsHttpEndpoint('POST', 'agents/helperAgent')
			.makeEndpointPublic()

		expect(() => builder.build()).toThrow('Agent handler is required. Call setHandler() before build().')

		const definition = builder.setHandler(async () => ({ message: 'ok' })).build()
		const manifest = definition.getManifest()
		expect(manifest.description).toBe('helper description')
		expect(manifest.eventBridge).toBe('customBridge')
		expect(manifest.resources?.llm?.resourceName).toBe('model')
		expect(manifest.session?.storeName).toBe('memoryStore')
		expect(manifest.knowledge?.[0]?.adapterName).toBe('knowledge2')
		expect(manifest.modelResource?.variant).toBe('mini')
		expect(manifest.allowedTools).toHaveLength(1)
		expect(manifest.telemetry?.attributes?.team).toBe('support')
		expect(manifest.metadata?.runtime).toBe('worker')
		expect(manifest.metadata?.evaluation).toEqual({ suite: 'smoke' })
		expect(manifest.httpExposure?.public).toBe(true)
	})

	it('builds a definition with model aliases and creates an instance', async () => {
		const definition = new AgentBuilder({
			agentName: 'supportAgent',
			agentVersion: '1',
			description: 'Support assistant',
		})
			.addPayloadSchema(
				z.object({
					prompt: z.string(),
				}),
			)
			.defineModel('echo')
			.persistConversation({ storeName: 'aiConversation', maxFrames: 10 })
			.exposeAsHttpEndpoint('POST', 'agents/supportAgent')
			.setStreamingMode('chunked')
			.setHandler<{ prompt: string }>(async (context, payload) => {
				const result = await context.models.echo.generate?.({ prompt: payload.prompt })
				if (!result) {
					throw new Error('missing text model capability')
				}
				context.stream.sendFinal(result.output)
				return { message: result.output }
			})
			.build()

		expect(definition.getManifest().models).toEqual([
			{
				alias: 'echo',
				capabilities: ['text', 'stream'],
			},
		])

		const instance = await definition.getInstance(
			{
				instanceId: 'bridge-1',
				invoke: async () => [],
			} as any,
			{
				models: {
					echo: new DeterministicTextProvider(),
				},
			},
		)
		expect(instance).toBeDefined()
	})

	it('keeps provider this-binding for stream capability wrappers', async () => {
		const definition = new AgentBuilder({
			agentName: 'bindingAgent',
			agentVersion: '1',
		})
			.addPayloadSchema(
				z.object({
					prompt: z.string(),
				}),
			)
			.defineModel('bound')
			.setHandler<{ prompt: string }>(async (context, payload) => {
				const stream = context.models.bound.stream?.({ prompt: payload.prompt })
				if (!stream) {
					throw new Error('missing stream provider')
				}
				const final = await stream.final()
				context.stream.sendFinal(final.output)
				return { message: final.output }
			})
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()
		const instance = await definition.getInstance(eventBridge, {
			models: {
				bound: new ThisBoundStreamProvider(),
			},
		})
		await instance.start()
		await new Promise(resolve => setTimeout(resolve, 25))
		try {
			const { envelopes } = await instance.invoke({
				payload: { prompt: 'hello' },
			})
			const finalMessage = envelopes
				.map(envelope => envelope.frame)
				.filter(
					(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'message' }> =>
						frame.kind === 'message' && frame.final === true,
				)
				.at(-1)
			expect(finalMessage?.content).toBe('stream:hello')
		} finally {
			await instance.stop()
		}
	})

	it('supports persistConversation presets with optional overrides', () => {
		const userPresetDefinition = new AgentBuilder({
			agentName: 'presetAgent',
			agentVersion: '1',
		})
			.persistConversation('user')
			.setHandler(async () => ({ message: 'ok' }))
			.build()

		expect(userPresetDefinition.getManifest().session).toEqual({
			storeName: 'presetAgent:1:user:history',
			strategy: 'full',
			maxFrames: 40,
		})

		const agentPresetDefinition = new AgentBuilder({
			agentName: 'presetAgent',
			agentVersion: '1',
		})
			.persistConversation('agent', { maxFrames: 5, storeName: 'custom-agent-history' })
			.setHandler(async () => ({ message: 'ok' }))
			.build()

		expect(agentPresetDefinition.getManifest().session).toEqual({
			storeName: 'custom-agent-history',
			strategy: 'summary',
			maxFrames: 5,
		})
	})

	it('infers typed knowledge aliases in handler context', () => {
		const definition = new AgentBuilder({ agentName: 'typedKnowledgeAgent', agentVersion: '1' })
			.useKnowledgeAdapter('supportFaq')
			.useKnowledgeAdapter('billingPolicy')
			.setHandler(async context => {
				await context.knowledge.supportFaq.query('reset password', { limit: 2 })
				await context.knowledge.billingPolicy.query('invoice', 2)
				// @ts-expect-error unknown adapter alias should fail at compile-time
				await context.knowledge.unknownAdapter.query('x')
				return { message: 'ok' }
			})
			.build()

		// @ts-expect-error knowledgeAdapters become required once aliases are defined
		void definition.getInstance({} as any)
	})

	it('fails fast when required model aliases are missing at getInstance()', async () => {
		const definition = new AgentBuilder({ agentName: 'missingModelAgent', agentVersion: '1' })
			.defineModel('missing')
			.setHandler(async () => ({ message: 'ok' }))
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()

		await expect(definition.getInstance(eventBridge, { models: {} })).rejects.toThrow(
			'Missing model provider for alias "missing"',
		)
	})

	it('fails fast when a required model capability is missing', async () => {
		const definition = new AgentBuilder({ agentName: 'embeddingAgent', agentVersion: '1' })
			.defineModel('echo', { capabilities: ['embedding'] })
			.setHandler(async () => ({ message: 'ok' }))
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()

		await expect(
			definition.getInstance(eventBridge, {
				models: {
					echo: new DeterministicTextProvider(),
				},
			}),
		).rejects.toThrow('Model provider "echo" does not support required capability "embedding"')
	})

	it('infers model capabilities from defineModel into handler context', () => {
		new AgentBuilder({ agentName: 'typedModelAgent', agentVersion: '1' })
			.defineModel('textOnly')
			.defineModel('jsoner', { capabilities: ['json'] })
			.defineModel('embedder', { capabilities: ['embedding'] })
			.defineModel('reranker', { capabilities: ['rerank'] })
			.setHandler(async context => {
				await context.models.textOnly.generate({ prompt: 'hello' })
				await context.models.jsoner.generateJson({ prompt: 'classify', schema: z.object({ ok: z.boolean() }) })
				await context.embeddings.embedder.embed({ value: 'hello' })
				await context.rerankers.reranker.rerank({ query: 'q', documents: ['a', 'b'] })
				// @ts-expect-error textOnly does not expose embedding capability
				await context.embeddings.textOnly.embed({ value: 'x' })
				// @ts-expect-error embedder does not expose text generation capability
				await context.models.embedder.generate({ prompt: 'x' })
				// @ts-expect-error textOnly does not expose JSON generation capability
				await context.models.textOnly.generateJson({ prompt: 'x' })
				return { message: 'ok' }
			})
	})
})
