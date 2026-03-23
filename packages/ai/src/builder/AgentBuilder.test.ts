import { DefaultEventBridge, DefaultQueueBridge } from '@purista/core'
import { afterEach, describe, expect, it } from 'vitest'
import { z } from 'zod'

import type { ModelProvider, ProviderRequest } from '../providers/runtime/ModelProvider.js'
import { invokeAgent } from '../runtime/invokeAgent.js'
import { AgentBuilder } from './AgentBuilder.js'

const findLastFinalMessage = (frames: Array<{ kind: string; final?: boolean; content?: unknown }>) => {
	for (let index = frames.length - 1; index >= 0; index -= 1) {
		const frame = frames[index]
		if (frame?.kind === 'message' && frame.final === true) {
			return frame
		}
	}
	return undefined
}

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

class RecordingProvider implements ModelProvider {
	readonly name = 'recording-provider'
	readonly capabilities = { text: true, stream: true }
	readonly calls: Array<{ kind: 'generate' | 'stream'; metadata?: Record<string, unknown> }> = []

	async generate(request: ProviderRequest) {
		this.calls.push({ kind: 'generate', metadata: request.metadata })
		return {
			output: request.prompt,
			tokens: { prompt: 1, completion: 1 },
		}
	}

	stream(request: ProviderRequest) {
		this.calls.push({ kind: 'stream', metadata: request.metadata })
		return {
			async final() {
				return { output: request.prompt, tokens: { prompt: 1, completion: 1 } }
			},
			async *[Symbol.asyncIterator]() {
				yield { type: 'text-delta' as const, textDelta: request.prompt }
			},
		}
	}
}

class AutomaticDefaultsProvider implements ModelProvider {
	readonly name = 'automatic-defaults-provider'
	readonly capabilities = { text: true, stream: true }
	lastRequest?: ProviderRequest

	async generate(request: ProviderRequest) {
		this.lastRequest = request
		return {
			output: 'ok',
			tokens: { prompt: 1, completion: 1 },
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
		expect(() => builder.setStreamingMode('stream')).toThrow(
			'Call exposeAsHttpEndpoint before configuring the streaming mode',
		)
	})

	it('requires exposeAsHttpEndpoint before setSseProtocol', () => {
		const builder = new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
		expect(() => builder.setSseProtocol('ai-sdk-ui-message')).toThrow(
			'Call exposeAsHttpEndpoint before configuring the SSE protocol',
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
			.useConversationStore({ storeName: 'sessions', maxFrames: 20 })
			.setRuntime('worker')
			.setExecutionMode('queued')
			.setExecutionPolicy({ maxAttempts: 4, scopeFromPayload: ['projectId'] })
			.setModelResource({ resourceName: 'modelResource', variant: 'mini' })
			.setRetryPolicy({ maxAttempts: 2, strategy: 'fixed', delayMs: 100 })
			.setMemory({ storeName: 'memoryStore', maxFrames: 10 })
			.useSkills(['spec-elicitation', 'architecture-synthesis'])
			.canInvoke('Ticketing', '1', 'createTicket')
			.canInvokeAgent('triageAgent', '1')
			.setTelemetry({ attributes: { team: 'support' } })
			.setEvaluation({ suite: 'smoke' })
			.addPayloadSchema(payloadSchema)
			.setInputSchema(payloadSchema)
			.addParameterSchema(parameterSchema)
			.addOutputSchema(outputSchema)
			.addContextSchema(contextSchema)
			.setContextSchema(contextSchema)
			.exposeAsHttpEndpoint('POST', 'agents/helperAgent')
			.setSseProtocol('ai-sdk-responses')
			.makeEndpointPublic()

		expect(() => builder.build()).toThrow('Agent handler is required. Call setHandler() before build().')

		const definition = builder.setHandler(async () => ({ message: 'ok' })).build()
		const manifest = definition.getManifest()
		expect(manifest.description).toBe('helper description')
		expect(manifest.eventBridge).toBe('customBridge')
		expect(manifest.resources?.llm?.resourceName).toBe('model')
		expect(manifest.resources?.skills?.resourceName).toBe('skills')
		expect(manifest.session?.storeName).toBe('memoryStore')
		expect(manifest.modelResource?.variant).toBe('mini')
		expect(manifest.skills).toEqual({
			resourceName: 'skills',
			names: ['spec-elicitation', 'architecture-synthesis'],
		})
		expect(manifest.allowedTools).toHaveLength(1)
		expect(
			manifest.allowedTools.some(
				t => t.serviceName === 'Ticketing' && t.serviceVersion === '1' && t.commandName === 'createTicket',
			),
		).toBe(true)
		expect(manifest.allowedAgents).toEqual([{ agentName: 'triageAgent', agentVersion: '1' }])
		expect(manifest.telemetry?.attributes?.team).toBe('support')
		expect(manifest.metadata?.runtime).toBe('worker')
		expect(manifest.executionMode).toBe('queued')
		expect(manifest.executionPolicy?.maxAttempts).toBe(4)
		expect(manifest.executionPolicy?.scopeFromPayload).toEqual(['projectId'])
		expect(manifest.metadata?.evaluation).toEqual({ suite: 'smoke' })
		expect(manifest.httpExposure?.public).toBe(true)
		expect(manifest.httpExposure?.sseProtocol).toBe('ai-sdk-responses')
		expect(manifest.httpExposure?.path).toBe('agents/helperAgent')
		expect(manifest.httpExposure?.streamingMode).toBe('stream')
	})

	it('declares runtime resources through defineResource and requires them at instance creation', async () => {
		const definition = new AgentBuilder({
			agentName: 'resourcefulAgent',
			agentVersion: '1',
		})
			.defineResource<'supportPolicy', { conciseAnswers: boolean }>()
			.setHandler(async context => ({ message: context.resources.supportPolicy.conciseAnswers ? 'short' : 'long' }))
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()

		const instance = await (definition as any).getInstance(eventBridge, { models: {} })
		await expect(instance.start()).rejects.toThrow('This services requires resources to be set in getInstance options')
	})

	it('validates and merges runtime config declared via setConfigSchema and setDefaultConfig', async () => {
		const definition = new AgentBuilder({
			agentName: 'configuredAgent',
			agentVersion: '1',
		})
			.setConfigSchema(
				z.object({
					locale: z.string().min(2),
				}),
			)
			.setDefaultConfig({ locale: 'en' })
			.setHandler(async () => ({ message: 'ok' }))
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()

		const defaultedInstance = await definition.getInstance(eventBridge, { models: {} })
		await defaultedInstance.start()
		try {
			expect(
				(defaultedInstance as unknown as { service?: { config?: { runtime?: { locale?: string } } } }).service?.config
					?.runtime?.locale,
			).toBe('en')
		} finally {
			await defaultedInstance.stop()
		}

		const overriddenInstance = await definition.getInstance(eventBridge, {
			models: {},
			config: { locale: 'de' },
		})
		await overriddenInstance.start()
		try {
			expect(
				(overriddenInstance as unknown as { service?: { config?: { runtime?: { locale?: string } } } }).service?.config
					?.runtime?.locale,
			).toBe('de')
		} finally {
			await overriddenInstance.stop()
		}

		expect(definition.getDefaultConfig()).toEqual({ locale: 'en' })

		const invalidInstance = await definition.getInstance(eventBridge, {
			models: {},
			config: { locale: '' },
		})
		await expect(invalidInstance.start()).rejects.toThrow('The given agent runtime configuration is invalid')
	})

	it('marks command and stream exposure as deprecated', async () => {
		const builder = new AgentBuilder({
			agentName: 'deprecatedAgent',
			agentVersion: '1',
		})
			.markAsDeprecated()
			.exposeAsHttpEndpoint('POST', 'agents/deprecatedAgent')
			.setHandler(async () => ({ message: 'ok' }))

		const definition = builder.build()
		expect(definition.getManifest().deprecated).toBe(true)

		const serviceDefinition = await (builder as any).serviceBuilder.getFullServiceDefinition()
		expect(serviceDefinition.commands[0]?.metadata?.expose?.deprecated).toBe(true)
		expect(serviceDefinition.streams[0]?.metadata?.expose?.deprecated).toBe(true)
	})

	it('executes before and after guard hooks for command invocations', async () => {
		const order: string[] = []
		const definition = new AgentBuilder({
			agentName: 'guardedCommandAgent',
			agentVersion: '1',
		})
			.setBeforeGuardHooks({
				before: async function before() {
					order.push('before')
				},
			})
			.setAfterGuardHooks({
				after: async function after() {
					order.push('after')
				},
			})
			.setHandler(async () => {
				order.push('handler')
				return { message: 'ok' }
			})
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()
		const instance = await definition.getInstance(eventBridge, { models: {} })
		await instance.start()
		try {
			await instance.invoke({ payload: {} })
		} finally {
			await instance.stop()
		}

		expect(order).toEqual(['before', 'handler', 'after'])
	})

	it('executes before and after guard hooks for streamed invocations', async () => {
		const order: string[] = []
		const definition = new AgentBuilder({
			agentName: 'guardedStreamAgent',
			agentVersion: '1',
		})
			.setBeforeGuardHooks({
				before: async function before() {
					order.push('before')
				},
			})
			.setAfterGuardHooks({
				after: async function after() {
					order.push('after')
				},
			})
			.setHandler(async context => {
				order.push('handler')
				context.stream.sendFinal('ok')
				return { message: 'ok' }
			})
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()
		const instance = await definition.getInstance(eventBridge, { models: {} })
		await instance.start()
		try {
			await invokeAgent({
				eventBridge,
				agentName: 'guardedStreamAgent',
				agentVersion: '1',
				payload: {},
			})
		} finally {
			await instance.stop()
		}

		expect(order).toEqual(['before', 'handler', 'after'])
	})

	it('automatically injects declared skills and allowlisted bindings into model text calls', async () => {
		const provider = new AutomaticDefaultsProvider()
		const definition = new AgentBuilder({
			agentName: 'autoDefaultsAgent',
			agentVersion: '1',
		})
			.addPayloadSchema(z.object({ prompt: z.string() }))
			.defineModel('openai:primary', { capabilities: ['text', 'stream'] })
			.useSkills(['spec-elicitation'])
			.canInvoke('support', '1', 'lookupFaq')
			.canInvokeAgent('triageAgent', '1')
			.setHandler(async (context, payload) => {
				const answer = await context.models['openai:primary'].generateText({
					prompt: payload.prompt,
				})
				return { message: answer }
			})
			.build()

		const bridge = new DefaultEventBridge()
		bridges.push(bridge)
		await bridge.start()

		const instance = await definition.getInstance(bridge, {
			models: { 'openai:primary': provider },
			skills: {
				'spec-elicitation': {
					content: 'Ask clarifying questions first.',
				},
			},
		})

		await instance.start()
		try {
			await instance.invoke({
				payload: { prompt: 'Help' },
			})
			expect(provider.lastRequest?.skills).toEqual([
				expect.objectContaining({
					name: 'spec-elicitation',
					content: 'Ask clarifying questions first.',
				}),
			])
			const bindings = Array.isArray(provider.lastRequest?.bindings)
				? provider.lastRequest?.bindings
				: Object.values(provider.lastRequest?.bindings ?? {})
			expect(bindings.map(binding => binding.name)).toEqual(
				expect.arrayContaining(['support.1.lookupFaq', 'triageAgent.1.run']),
			)
		} finally {
			await instance.stop()
		}
	})

	it('supports aggregate streaming mode for unary HTTP responses', () => {
		const manifest = new AgentBuilder({ agentName: 'aggregateAgent', agentVersion: '1' })
			.addPayloadSchema(z.object({ prompt: z.string() }))
			.exposeAsHttpEndpoint('POST', 'agents/aggregateAgent')
			.setStreamingMode('aggregate')
			.setHandler(async () => ({ message: 'ok' }))
			.build()
			.getManifest()

		expect(manifest.httpExposure?.streamingMode).toBe('aggregate')
	})

	it('runs queued durable agents through the internal queue and emits run-state artifacts', async () => {
		const bridge = new DefaultEventBridge()
		bridges.push(bridge)
		await bridge.start()
		const queueBridge = new DefaultQueueBridge()
		const definition = new AgentBuilder({
			agentName: 'queuedAgent',
			agentVersion: '1',
			description: 'Queued durable agent',
		})
			.addPayloadSchema(z.object({ prompt: z.string(), projectId: z.string() }))
			.setExecutionMode('queued')
			.setExecutionPolicy({
				maxDurationMs: 3_000,
				leaseTtlMs: 100,
				heartbeatIntervalMs: 10,
				scopeFromPayload: ['projectId'],
			})
			.setHandler(async (context, payload) => {
				await context.runState.update({ phase: 'planning', status: 'planning' })
				await context.runState.replaceTasks([
					{ id: 'plan', title: 'Plan work' },
					{ id: 'deliver', title: 'Deliver answer' },
				])
				await context.runState.checkpoint('plan', { prompt: payload.prompt }, { completed: true })
				await context.runState.startTask('plan')
				await context.runState.completeTask('plan')
				await context.runState.startTask('deliver')
				await context.runState.completeTask('deliver', payload.prompt.toUpperCase())
				context.stream.sendFinal(`queued:${payload.prompt}`)
				return { message: `queued:${payload.prompt}` }
			})
			.build()

		const instance = await definition.getInstance(bridge, {
			queueBridge,
		})
		await instance.start()

		try {
			const result = await instance.invoke({
				payload: { prompt: 'hello', projectId: 'voyage' },
			})
			const finalMessage = findLastFinalMessage(result.envelopes.map(envelope => envelope.frame))
			expect(finalMessage?.content).toBe('queued:hello')
			expect(
				result.envelopes.some(
					envelope => envelope.frame.kind === 'artifact' && envelope.frame.artifactId === 'run-state',
				),
			).toBe(true)
		} finally {
			await instance.stop()
			await queueBridge.destroy()
		}
	})

	it('executes declared guard hooks for queued durable agents', async () => {
		const order: string[] = []
		const bridge = new DefaultEventBridge()
		bridges.push(bridge)
		await bridge.start()
		const queueBridge = new DefaultQueueBridge()

		const definition = new AgentBuilder({
			agentName: 'guardedQueuedAgent',
			agentVersion: '1',
		})
			.addPayloadSchema(z.object({ prompt: z.string(), projectId: z.string() }))
			.setExecutionMode('queued')
			.setExecutionPolicy({
				maxDurationMs: 3_000,
				leaseTtlMs: 100,
				heartbeatIntervalMs: 10,
				scopeFromPayload: ['projectId'],
			})
			.setBeforeGuardHooks({
				before: async function before(_context, payload) {
					order.push(`before:${String((payload as { prompt: string }).prompt)}`)
				},
			})
			.setAfterGuardHooks({
				after: async function after(_context, _payload, _parameter, result) {
					order.push(`after:${typeof result === 'string' ? result : String(result?.message ?? '')}`)
				},
			})
			.setHandler(async (_context, payload) => {
				order.push(`handler:${payload.prompt}`)
				return { message: `queued:${payload.prompt}` }
			})
			.build()

		const instance = await definition.getInstance(bridge, { queueBridge })
		await instance.start()
		try {
			await instance.invoke({
				payload: { prompt: 'hello', projectId: 'voyage' },
			})
		} finally {
			await instance.stop()
			await queueBridge.destroy()
		}

		expect(order).toEqual(['before:hello', 'handler:hello', 'after:queued:hello'])
	})

	it('derives queue lease extensions from agent execution policy for queued agents', async () => {
		const builder = new AgentBuilder({
			agentName: 'leaseAwareAgent',
			agentVersion: '1',
			description: 'Queued agent with derived queue lease budget',
		})
			.addPayloadSchema(z.object({ prompt: z.string(), projectId: z.string() }))
			.setExecutionMode('queued')
			.setExecutionPolicy({
				leaseTtlMs: 30_000,
				heartbeatIntervalMs: 10_000,
				maxDurationMs: 15 * 60_000,
				scopeFromPayload: ['projectId'],
			})
			.setHandler(async () => ({ message: 'ok' }))

		builder.build()
		const serviceDefinition = await (builder as any).serviceBuilder.getFullServiceDefinition()
		const queueDefinition = serviceDefinition.queues.find(
			(definition: { queueName: string }) => definition.queueName === 'agent:leaseAwareAgent:1:run',
		)

		expect(queueDefinition?.lifecycle?.visibilityTimeoutMs).toBe(30_000)
		expect(queueDefinition?.lifecycle?.heartbeatIntervalMs).toBe(10_000)
		expect(queueDefinition?.lifecycle?.maxLeaseExtensions).toBe(31)
	})

	it('honors explicit maxLeaseExtensions overrides for queued agents', async () => {
		const builder = new AgentBuilder({
			agentName: 'explicitLeaseAgent',
			agentVersion: '1',
			description: 'Queued agent with explicit lease override',
		})
			.addPayloadSchema(z.object({ prompt: z.string(), projectId: z.string() }))
			.setExecutionMode('queued')
			.setExecutionPolicy({
				leaseTtlMs: 30_000,
				heartbeatIntervalMs: 10_000,
				maxDurationMs: 15 * 60_000,
				maxLeaseExtensions: 64,
				scopeFromPayload: ['projectId'],
			})
			.setHandler(async () => ({ message: 'ok' }))

		builder.build()
		const serviceDefinition = await (builder as any).serviceBuilder.getFullServiceDefinition()
		const queueDefinition = serviceDefinition.queues.find(
			(definition: { queueName: string }) => definition.queueName === 'agent:explicitLeaseAgent:1:run',
		)

		expect(queueDefinition?.lifecycle?.maxLeaseExtensions).toBe(64)
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
			.setStreamingMode('stream')
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
			poolConfig: {
				poolId: 'binding',
				maxConcurrencyPerInstance: 2,
			},
			concurrencyHints: {
				replicaCountHint: 3,
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
			const telemetry = envelopes
				.map(envelope => envelope.frame)
				.filter(
					(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'telemetry' }> =>
						frame.kind === 'telemetry',
				)
				.at(-1)
			expect(finalMessage?.content).toBe('stream:hello')
			expect(telemetry?.poolId).toBe('binding')
			expect(telemetry?.maxConcurrencyPerInstance).toBe(2)
			expect(telemetry?.effectiveMaxConcurrencyHint).toBe(6)
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

	it('applies prepareStep hooks and validates call options schema', async () => {
		const provider = new RecordingProvider()
		const steps: Array<{ step: number; stepByAliasAndKind: number; kind: string }> = []

		const definition = new AgentBuilder({ agentName: 'prepareStepAgent', agentVersion: '1' })
			.defineModel('echo')
			.setCallOptionsSchema(
				z.object({
					metadata: z.record(z.string(), z.unknown()).optional(),
					aiSdk: z.record(z.string(), z.unknown()).optional(),
				}),
			)
			.prepareStep(input => {
				steps.push({
					step: input.step,
					stepByAliasAndKind: input.stepByAliasAndKind,
					kind: input.callKind,
				})
				return {
					metadata: { hook: 'ok' },
					aiSdk: { generate: { temperature: 0.2 } },
				}
			})
			.setHandler(async context => {
				await context.models.echo.generate?.({ prompt: 'first' })
				await context.models.echo.generate?.({ prompt: 'second' })
				return { message: 'done' }
			})
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()
		const instance = await definition.getInstance(eventBridge, {
			models: {
				echo: provider,
			},
		})
		await instance.start()
		try {
			await instance.invoke({ payload: {} })
		} finally {
			await instance.stop()
		}

		expect(steps).toEqual([
			{ step: 1, stepByAliasAndKind: 1, kind: 'generate' },
			{ step: 2, stepByAliasAndKind: 2, kind: 'generate' },
		])
		expect(provider.calls[0]?.metadata?.hook).toBe('ok')
		expect((provider.calls[0]?.metadata?.aiSdk as any)?.generate?.temperature).toBe(0.2)
	})

	it('fails agent run when call option hooks return invalid schema payload', async () => {
		const definition = new AgentBuilder({ agentName: 'invalidCallOptionsAgent', agentVersion: '1' })
			.defineModel('echo')
			.setCallOptionsSchema(
				z.object({
					aiSdk: z.object({
						generate: z.object({
							temperature: z.number(),
						}),
					}),
				}),
			)
			.prepareCall(() => ({
				aiSdk: {
					generate: {
						temperature: 'not-a-number',
					},
				},
			}))
			.setHandler(async context => {
				await context.models.echo.generate?.({ prompt: 'hello' })
				return { message: 'ok' }
			})
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()
		const instance = await definition.getInstance(eventBridge, {
			models: {
				echo: new DeterministicTextProvider(),
			},
		})
		await instance.start()
		try {
			const result = await instance.invoke({ payload: {} })
			const errorFrame = result.envelopes.map(envelope => envelope.frame).find(frame => frame.kind === 'error')
			expect(errorFrame).toBeDefined()
		} finally {
			await instance.stop()
		}
	})

	it('supports subagent orchestration through context.agents helpers', async () => {
		const childDefinition = new AgentBuilder({ agentName: 'childAgent', agentVersion: '1' })
			.setHandler(async () => ({ message: 'child-response' }))
			.build()

		const parentDefinition = new AgentBuilder({ agentName: 'parentAgent', agentVersion: '1' })
			.canInvokeAgent('childAgent', '1')
			.setHandler(async context => {
				const text = await context.agents.runText({
					agentName: 'childAgent',
					agentVersion: '1',
					payload: { prompt: 'from-parent' },
				})
				return { message: `parent:${text}` }
			})
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()

		const childInstance = await childDefinition.getInstance(eventBridge, { models: {} })
		const parentInstance = await parentDefinition.getInstance(eventBridge, { models: {} })
		await childInstance.start()
		await parentInstance.start()
		try {
			const result = await parentInstance.invoke({ payload: {} })
			const finalMessage = findLastFinalMessage(result.envelopes.map(envelope => envelope.frame))
			expect(finalMessage && 'content' in finalMessage ? finalMessage.content : '').toBe('parent:child-response')
		} finally {
			await parentInstance.stop()
			await childInstance.stop()
		}
	})

	it('supports canEmit declarations with context.emit in agent handlers', async () => {
		const definition = new AgentBuilder({ agentName: 'emitAgent', agentVersion: '1' })
			.canEmit('agent.finished', z.object({ ok: z.boolean() }))
			.setHandler(async context => {
				await (context.emit as (eventName: string, payload: { ok: boolean }) => Promise<void>)('agent.finished', {
					ok: true,
				})
				return { message: 'done' }
			})
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()
		const instance = await definition.getInstance(eventBridge, { models: {} })
		await instance.start()
		try {
			const result = await instance.invoke({ payload: {} })
			const errorFrame = result.envelopes.map(envelope => envelope.frame).find(frame => frame.kind === 'error')
			const finalMessage = findLastFinalMessage(result.envelopes.map(envelope => envelope.frame))
			expect(errorFrame).toBeUndefined()
			expect(finalMessage && 'content' in finalMessage ? finalMessage.content : '').toBe('done')
		} finally {
			await instance.stop()
		}
	})

	it('supports command-style result-as-event via setSuccessEventName', async () => {
		const definition = new AgentBuilder({ agentName: 'resultEventAgent', agentVersion: '1' })
			.setSuccessEventName('resultEventAgent.finished')
			.setHandler(async () => ({ message: 'done' }))
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()
		const instance = await definition.getInstance(eventBridge, { models: {} })
		await instance.start()
		try {
			const result = await instance.invoke({ payload: {} })
			const errorFrame = result.envelopes.map(envelope => envelope.frame).find(frame => frame.kind === 'error')
			const finalMessage = findLastFinalMessage(result.envelopes.map(envelope => envelope.frame))
			expect(errorFrame).toBeUndefined()
			expect(finalMessage && 'content' in finalMessage ? finalMessage.content : '').toBe('done')
		} finally {
			await instance.stop()
		}
	})

	it('supports command-style result-as-event configured in constructor', async () => {
		const definition = new AgentBuilder({
			agentName: 'constructorResultEventAgent',
			agentVersion: '1',
			successEventName: 'constructorResultEventAgent.finished',
		})
			.setHandler(async () => ({ message: 'done' }))
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()
		const instance = await definition.getInstance(eventBridge, { models: {} })
		await instance.start()
		try {
			const result = await instance.invoke({ payload: {} })
			const errorFrame = result.envelopes.map(envelope => envelope.frame).find(frame => frame.kind === 'error')
			const finalMessage = findLastFinalMessage(result.envelopes.map(envelope => envelope.frame))
			expect(errorFrame).toBeUndefined()
			expect(finalMessage && 'content' in finalMessage ? finalMessage.content : '').toBe('done')
		} finally {
			await instance.stop()
		}
	})
})
