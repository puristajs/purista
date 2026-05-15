import * as aiExports from '@purista/ai'
import { AgentQueueBuilder } from '@purista/ai'
import * as testingExports from '@purista/ai/testing'
import { createAgentContextMock, createAgentTestHarness, createScriptedHarnessModel } from '@purista/ai/testing'
import { DefaultEventBridge, DefaultQueueBridge, ServiceBuilder } from '@purista/core'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import { createAgentHandlerContext } from './runtime/context.js'
import { createAgentRunEvent } from './runtime/events.js'
import { createAgentExecutor } from './runtime/executor.js'
import { deriveAgentRunIdentity } from './runtime/identity.js'
import { createPuristaHarnessLogger } from './runtime/logger.js'
import { resolveRuntimeModelBindings } from './runtime/modelBindings.js'
import { agentContentPartSchema, agentSseEventSchema, createProviderSseEvent } from './runtime/sseEvents.js'

const usage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 }

describe('clean public package surface', () => {
	it('exports only the curated shell values', () => {
		const forbidden = [
			['Ai', 'Sdk', 'Provider'].join(''),
			['Agent', 'Protocol', 'Envelope'].join(''),
			['Pool', 'Manager'].join(''),
			['Model', 'Router'].join(''),
		]

		for (const name of forbidden) {
			expect(aiExports).not.toHaveProperty(name)
		}

		expect(aiExports).not.toHaveProperty('ServiceBuilder')
		expect(aiExports).toHaveProperty('AgentQueueBuilder', AgentQueueBuilder)
		expect(aiExports).not.toHaveProperty('createAgentContextMock')
		expect(aiExports).not.toHaveProperty('createAgentTestHarness')
		expect(aiExports).not.toHaveProperty('createScriptedHarnessModel')
		expect(testingExports).toHaveProperty('createAgentContextMock')
		expect(testingExports).toHaveProperty('createAgentTestHarness')
		expect(testingExports).toHaveProperty('createScriptedHarnessModel')
		expect(aiExports).toHaveProperty('agentSseEventSchema')
		expect(aiExports).toHaveProperty('agentContentPartSchema')
	})
})

describe('AgentQueueBuilder', () => {
	const payloadSchema = z.object({
		ticketId: z.string(),
		conversation: z.object({ id: z.string() }),
	})
	const parameterSchema = z.object({ locale: z.string().optional() })
	const outputSchema = z.object({ priority: z.enum(['low', 'high']) })

	it('cascades schemas and model aliases into the handler context', async () => {
		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify support tickets')
			.addPayloadSchema(payloadSchema)
			.addParameterSchema(parameterSchema)
			.addOutputSchema(outputSchema)
			.addModel('primary', {
				model: 'fake-object',
				capabilities: ['object', 'tool_use'] as const,
				defaults: { temperature: 0 },
			})
			.setRunFunction(async context => {
				expectTypeOf(context.payload.ticketId).toEqualTypeOf<string>()
				expectTypeOf(context.parameter.locale).toEqualTypeOf<string | undefined>()
				expectTypeOf(context.harness.models.primary.object).toBeFunction()

				return { priority: 'high' }
			})
			.getDefinition()

		expect(definition.manifest.models.primary).toMatchObject({
			model: 'fake-object',
			capabilities: ['object', 'tool_use'],
		})
		expect(definition.queue.queueName).toBe('agent:support:1:triage')
		expect(definition.worker.queueName).toBe(definition.queue.queueName)
		expect(definition.command.commandName).toBe('triage')
		expect(definition.stream.streamName).toBe('triageStream')
	})

	it('declares provider-style SSE chunks for stream OpenAPI metadata', async () => {
		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify support tickets')
			.addOutputSchema(outputSchema)
			.addModel('primary', { model: 'fake-object', capabilities: ['object'] as const })
			.setRunFunction(async () => ({ priority: 'high' }))
			.exposeAsHttpEndpoint('POST', '/agents/triage', { streamingMode: 'stream' })
			.getDefinition()

		expect(agentContentPartSchema.parse({ kind: 'image_url', url: 'https://example.com/image.png' })).toEqual({
			kind: 'image_url',
			url: 'https://example.com/image.png',
		})
		expect((definition.stream as any).metadata.expose.contentTypeResponse).toBe('text/event-stream')
		expect((definition.stream as any).metadata.expose.http.stream).toMatchObject({
			mode: 'stream',
			protocol: 'openai-compatible-event-stream',
		})
		expect((definition.stream as any).metadata.expose.chunkPayload).toBeTruthy()
	})

	it('maps long-running response mode onto queue profile and result policy metadata', async () => {
		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify support tickets')
			.addPayloadSchema(payloadSchema)
			.addParameterSchema(parameterSchema)
			.addOutputSchema(outputSchema)
			.setExecutionProfile('longRunning', { maxRuntimeMs: 30 * 60_000, strict: true })
			.setResponseMode('accepted', {
				resultPolicy: 'state-and-event',
				statusUrl: '/jobs/{jobId}',
				streamUrl: '/jobs/{jobId}/events',
			})
			.setRunFunction(async () => ({ priority: 'high' }))
			.exposeAsHttpEndpoint('POST', '/agents/triage', { streamingMode: 'aggregate' })
			.getDefinition()

		expect(definition.manifest.response).toMatchObject({
			mode: 'accepted',
			jobId: { source: 'queue-job-id' },
			runId: { source: 'queue-job-id', prefix: 'run:' },
		})
		expect((definition.queue as any).executionProfile).toMatchObject({
			name: 'longRunning',
			maxRuntimeMs: 30 * 60_000,
			strict: true,
		})
		expect((definition.queue as any).lifecycle).toMatchObject({
			autoHeartbeat: true,
			heartbeatIntervalMs: 60_000,
			visibilityTimeoutMs: 5 * 60_000,
			maxAttempts: 3,
		})
		expect((definition.queue as any).resultPolicy).toMatchObject({
			mode: 'state-and-event',
			successEventName: 'support.triage.completed',
			failureEventName: 'support.triage.failed',
		})
		expect((definition.queue as any).metadata.agent.response).toMatchObject({
			mode: 'accepted',
			jobId: { source: 'queue-job-id' },
			runId: { source: 'queue-job-id', prefix: 'run:' },
		})
		expect((definition.command as any).metadata.expose.http.mode).toBe('async')
		expect((definition.command as any).queueInvokes[definition.queue.queueName]).toBeDefined()
	})

	it('gates handler model methods by declared capabilities', async () => {
		const model = createScriptedHarnessModel()
		model.enqueueObject({
			object: { priority: 'high' },
			usage,
			finishReason: 'stop',
		})

		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify support tickets')
			.addPayloadSchema(z.object({ text: z.string() }))
			.addOutputSchema(outputSchema)
			.addModel('primary', {
				model: 'fake-object',
				capabilities: ['object', 'tool_use'] as const,
			})
			.setRunFunction(async context => {
				expectTypeOf(context.harness.models.primary.object).toBeFunction()
				expectTypeOf(context.harness.models.primary).not.toHaveProperty('text')
				expectTypeOf(context.harness.models.primary).not.toHaveProperty('embed')

				expect('object' in context.harness.models.primary).toBe(true)
				expect(() => {
					;(
						context.harness.models.primary as unknown as { text(input: unknown, signal: AbortSignal): Promise<unknown> }
					).text({ messages: [{ role: 'user', content: context.payload.text }] }, context.signal)
				}).toThrow(/capability/i)

				const result = await context.harness.models.primary.object(
					{
						messages: [
							{ role: 'user', content: context.payload.text },
							{
								role: 'assistant',
								content: '',
								toolCalls: [{ id: 'call-1', name: 'lookupTicket', arguments: { ticketId: 'T-1' } }],
							},
							{ role: 'tool', toolCallId: 'call-1', content: '{"ok":true}' },
						],
						tools: [{ name: 'lookupTicket', description: 'Lookup ticket', parameters: { type: 'object' } }],
						schema: { type: 'object' },
					},
					context.signal,
				)

				return outputSchema.parse(result.object)
			})
			.getDefinition()

		const harness = createAgentTestHarness(definition, {
			models: {
				primary: {
					provider: model,
					model: 'fake-object',
					capabilities: ['object', 'tool_use'],
				},
			},
		})

		await expect(harness.run({ payload: { text: 'Please classify T-1' }, message: { id: 'msg-1' } })).resolves.toEqual({
			priority: 'high',
		})
		expect(model.requests).toHaveLength(1)
		expect(model.requests[0]).toMatchObject({ model: 'fake-object' })
	})

	it('executes text, embedding, and rerank calls through the fake model provider', async () => {
		const model = createScriptedHarnessModel()
		model.enqueueText({ content: 'classified', usage, finishReason: 'stop' })
		model.enqueueEmbedding({
			embeddings: [{ index: 0, vector: [0.1, 0.2] }],
			usage,
		})
		model.enqueueRerank({
			results: [{ id: 'doc-2', index: 1, score: 0.9 }],
			usage,
		})

		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify support tickets')
			.addPayloadSchema(z.object({ text: z.string() }))
			.addOutputSchema(z.object({ summary: z.string(), embeddingCount: z.number(), topDocument: z.string() }))
			.addModel('primary', {
				model: 'fake-multi',
				capabilities: ['text', 'embeddings', 'rerank'] as const,
				defaults: { temperature: 0.2 },
			})
			.setRunFunction(async context => {
				const text = await context.harness.models.primary.text(
					{ messages: [{ role: 'user', content: context.payload.text }] },
					context.signal,
				)
				const embedding = await context.harness.models.primary.embed({ input: context.payload.text }, context.signal)
				const rerank = await context.harness.models.primary.rerank(
					{
						query: context.payload.text,
						documents: [
							{ id: 'doc-1', text: 'low priority' },
							{ id: 'doc-2', text: 'high priority' },
						],
						topN: 1,
					},
					context.signal,
				)

				return {
					summary: text.content,
					embeddingCount: embedding.embeddings.length,
					topDocument: rerank.results[0]?.id ?? 'none',
				}
			})
			.getDefinition()

		const harness = createAgentTestHarness(definition, {
			models: {
				primary: {
					provider: model,
					model: 'fake-multi',
					capabilities: ['text', 'embeddings', 'rerank'],
				},
			},
		})

		await expect(harness.run({ payload: { text: 'Please classify T-2' }, message: { id: 'msg-1' } })).resolves.toEqual({
			summary: 'classified',
			embeddingCount: 1,
			topDocument: 'doc-2',
		})
		expect(model.requests.map(request => request.model)).toEqual(['fake-multi', 'fake-multi', 'fake-multi'])
		expect(model.requests[0]).toMatchObject({ defaults: { temperature: 0.2, providerOptions: {} } })
	})

	it('surfaces fake provider fallback output as schema validation failure', async () => {
		const model = createScriptedHarnessModel()
		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify support tickets')
			.addOutputSchema(outputSchema)
			.addModel('primary', { model: 'fake-object', capabilities: ['object'] as const })
			.setRunFunction(async context => {
				const response = await context.harness.models.primary.object(
					{ messages: [{ role: 'user', content: 'classify' }], schema: { type: 'object' } },
					context.signal,
				)
				return response.object as { priority: 'low' | 'high' }
			})
			.getDefinition()

		const harness = createAgentTestHarness(definition, {
			models: {
				primary: {
					provider: model,
					model: 'fake-object',
					capabilities: ['object'],
				},
			},
		})

		await expect(harness.run({ message: { id: 'msg-1' } })).rejects.toThrow(/output validation failed/i)
		expect(model.requests).toHaveLength(1)
	})

	it('rejects runtime bindings when provider-detected capabilities do not satisfy the manifest', async () => {
		const model = createScriptedHarnessModel() as ReturnType<typeof createScriptedHarnessModel> & {
			info: {
				providerId: string
				genAiSystem: string
				models: {
					'fake-object': { capabilities: readonly ['text'] }
				}
			}
		}
		model.info = {
			providerId: 'fake',
			genAiSystem: 'fake',
			models: {
				'fake-object': { capabilities: ['text'] },
			},
		}

		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify support tickets')
			.addModel('primary', { model: 'fake-object', capabilities: ['object'] as const })
			.setRunFunction(async () => ({ ok: true }))
			.getDefinition()

		expect(() =>
			resolveRuntimeModelBindings(definition.manifest, {
				primary: {
					provider: model,
					model: 'fake-object',
				},
			}),
		).toThrow(/missing required capabilities/i)
	})

	it('infers typed command-tool and child-agent invoke maps', async () => {
		const reservePayloadSchema = z.object({ sku: z.string() })
		const reserveOutputSchema = z.object({ reserved: z.boolean() })
		const childPayloadSchema = z.object({ ticketId: z.string() })
		const childOutputSchema = z.object({ priority: z.enum(['low', 'high']) })

		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify support tickets')
			.canInvoke('inventory', '1', 'reserve', {
				payloadSchema: reservePayloadSchema,
				outputSchema: reserveOutputSchema,
			})
			.canInvokeAgent('classifier', '1', {
				payloadSchema: childPayloadSchema,
				outputSchema: childOutputSchema,
			})
			.setRunFunction(async context => {
				const reserveResult = await context.invoke.tools['inventory.1.reserve'].call({ sku: 'SKU-1' })
				const childResult = await context.invoke.agents['classifier.1'].run({ ticketId: 'T-1' })

				expectTypeOf(reserveResult).toEqualTypeOf<{ reserved: boolean }>()
				expectTypeOf(childResult).toEqualTypeOf<{ priority: 'low' | 'high' }>()

				return { reserveResult, childResult }
			})
			.getDefinition()

		expect(definition.manifest.allowedCommands).toHaveLength(1)
		expect(definition.manifest.allowedCommands[0]).toMatchObject({
			serviceName: 'inventory',
			serviceVersion: '1',
			commandName: 'reserve',
		})
		expect(definition.manifest.allowedAgents).toHaveLength(1)
		expect(definition.manifest.allowedAgents[0]).toMatchObject({
			agentName: 'classifier',
			serviceVersion: '1',
		})
		expect((definition.command as any).invokes.inventory['1'].reserve).toBeDefined()
		expect((definition.command as any).invokes.support['1'].classifier).toBeDefined()
		expect((definition.stream as any).invokes.inventory['1'].reserve).toBeDefined()
		expect((definition.stream as any).invokes.support['1'].classifier).toBeDefined()
	})

	it('executes declared command tools and child agents through the runtime invoke bridge', async () => {
		const reservePayloadSchema = z.object({ sku: z.string() })
		const reserveOutputSchema = z.object({ reserved: z.boolean() })
		const childPayloadSchema = z.object({ ticketId: z.string() })
		const childOutputSchema = z.object({ priority: z.enum(['low', 'high']) })

		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify support tickets')
			.canInvoke('inventory', '1', 'reserve', {
				payloadSchema: reservePayloadSchema,
				outputSchema: reserveOutputSchema,
			})
			.canInvokeAgent('classifier', '1', {
				payloadSchema: childPayloadSchema,
				outputSchema: childOutputSchema,
			})
			.setRunFunction(async context => {
				const reserveResult = await context.invoke.tools['inventory.1.reserve'].call({ sku: 'SKU-1' })
				const childResult = await context.invoke.agents['classifier.1'].run({ ticketId: 'T-1' })
				return { reserveResult, childResult }
			})
			.getDefinition()

		const calls: string[] = []
		const executor = createAgentExecutor({
			definition,
			manifest: definition.manifest,
			models: {},
		})

		await expect(
			executor.executeAggregate({
				message: { id: 'msg-1' },
				payload: {},
				parameter: {},
				appContext: {
					service: {
						inventory: {
							'1': {
								reserve: async (payload: { sku: string }) => {
									calls.push(`reserve:${payload.sku}`)
									return { reserved: true }
								},
							},
						},
						support: {
							'1': {
								classifier: async (payload: { ticketId: string }) => {
									calls.push(`classifier:${payload.ticketId}`)
									return { priority: 'high' }
								},
							},
						},
					},
				},
			}),
		).resolves.toEqual({
			reserveResult: { reserved: true },
			childResult: { priority: 'high' },
		})
		expect(calls).toEqual(['reserve:SKU-1', 'classifier:T-1'])

		await executor.shutdown()
	})

	it('requires exactly one execution definition', async () => {
		await expect(new AgentQueueBuilder('support', '1', 'triage', 'Classify').getDefinition()).rejects.toThrow(
			/exactly one execution/i,
		)

		const builder = new AgentQueueBuilder('support', '1', 'triage', 'Classify')
			.addModel('primary', { model: 'fake-object', capabilities: ['object'] as const })
			.setRunFunction(async () => ({ ok: true }))

		expect(() => {
			;(builder as unknown as { setHarnessWorkflow(definition: unknown): unknown }).setHarnessWorkflow({
				handler: async () => ({ ok: true }),
			})
		}).toThrow(/already set/i)
	})
})

describe('ServiceBuilder', () => {
	it('requires queueBridge and declared runtime model aliases for attached agents', async () => {
		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify')
			.addPayloadSchema(z.object({ ticketId: z.string() }))
			.addOutputSchema(z.object({ priority: z.literal('high') }))
			.addModel('primary', { model: 'fake-object', capabilities: ['object'] as const })
			.setRunFunction(async () => ({ priority: 'high' }))
			.getDefinition()
		const service = new ServiceBuilder({
			serviceName: 'support',
			serviceVersion: '1',
			serviceDescription: 'Support',
		}).addAgentDefinition(definition)

		await expect(
			service.getInstance(createEventBridgeMock(), {
				ai: {
					models: {
						primary: {
							provider: createScriptedHarnessModel(),
							model: 'fake-object',
							capabilities: ['object'],
						},
					},
				},
			} as never),
		).rejects.toThrow(/queueBridge/i)

		await expect(
			service.getInstance(createEventBridgeMock(), {
				queueBridge: createQueueBridgeMock(),
				ai: { models: {} },
			} as never),
		).rejects.toThrow(/primary/i)
	})
})

describe('runtime identity and events', () => {
	const manifest = {
		serviceName: 'support',
		serviceVersion: '1',
		agentName: 'triage',
		runtimeRevision: 'rev-1',
		models: {},
		session: { mode: 'conversation' as const, payloadPath: ['conversation', 'id'] as const },
		execution: { maxAttempts: 3, maxParallelHandlers: 1 },
		streamingMode: 'stream' as const,
		allowedCommands: [],
		allowedAgents: [],
		usedSkills: [],
		builtInTools: true,
	}

	it('uses payload conversation identity instead of transport correlation', () => {
		const identity = deriveAgentRunIdentity({
			manifest,
			message: { id: 'msg-1', correlationId: 'transport-correlation' },
			payload: { conversation: { id: 'case-42' } },
		})

		expect(identity.harnessSessionId).toBe('case-42')
		expect(identity.correlationId).toBe('transport-correlation')
		expect(identity.harnessSessionId).not.toBe(identity.correlationId)
	})

	it('wraps harness events without cloning or remapping the event object', () => {
		const identity = deriveAgentRunIdentity({
			manifest: { ...manifest, session: { mode: 'ephemeral' as const } },
			message: { id: 'msg-2' },
			payload: {},
		})
		const event = { type: 'run.started' as const, runId: 'run-1', at: '2026-05-06T00:00:00.000Z' }

		expect(createAgentRunEvent(identity, event)).toEqual({
			identity: { ...identity, runId: 'run-1' },
			event,
		})
	})

	it('maps streamed harness deltas to provider-style SSE events', async () => {
		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify')
			.addOutputSchema(z.object({ priority: z.literal('high') }))
			.setRunFunction(async context => {
				await context.harness.events.emit({
					type: 'model.delta',
					runId: context.identity.runId,
					agentId: context.identity.agentName,
					delta: 'hel',
				})
				return { priority: 'high' }
			})
			.getDefinition()
		const harness = createAgentTestHarness(definition, { models: {} })

		const result = await harness.stream({ message: { id: 'msg-1' } })

		expect(agentSseEventSchema.parse(result.chunks[0])).toMatchObject({
			event: 'response.output_text.delta',
			data: {
				type: 'response.output_text.delta',
				sequence_number: 1,
				delta: 'hel',
			},
		})
		expect(result.final).toEqual({ priority: 'high' })
	})

	it('maps provider SSE branches for tool, object, embedding, rerank, and error events', () => {
		const at = '2026-05-06T00:00:00.000Z'
		const events = [
			{ type: 'run.started', runId: 'run-1', at },
			{ type: 'agent.started', runId: 'run-1', agentId: 'triage', at },
			{ type: 'model.object.partial', runId: 'run-1', agentId: 'triage', partial: { priority: 'h' } },
			{ type: 'model.object', runId: 'run-1', agentId: 'triage', object: { priority: 'high' } },
			{ type: 'tool.started', runId: 'run-1', agentId: 'triage', callId: 'call-1', toolId: 'lookup', input: {} },
			{
				type: 'tool.finished',
				runId: 'run-1',
				agentId: 'triage',
				callId: 'call-1',
				toolId: 'lookup',
				output: { ok: true },
			},
			{ type: 'model.embedding.completed', runId: 'run-1', agentId: 'triage', count: 2, dimensions: 3, usage },
			{ type: 'model.rerank.completed', runId: 'run-1', agentId: 'triage', count: 3, topN: 1, usage },
			{ type: 'agent.finished', runId: 'run-1', agentId: 'triage', at, output: { priority: 'high' } },
			{ type: 'model.message', runId: 'run-1', agentId: 'triage', message: { role: 'assistant', content: 'done' } },
			{ type: 'stream.overflow', runId: 'run-1', agentId: 'triage', dropped: 4 },
			{ type: 'run.finished', runId: 'run-1', at, output: { priority: 'high' } },
			{
				type: 'run.finished',
				runId: 'run-1',
				at,
				error: { code: 'MODEL_FAILED', category: 'model', retriable: true, message: 'model failed' },
			},
		]

		const mapped = events.map((event, index) =>
			agentSseEventSchema.parse(createProviderSseEvent({ identity: { runId: 'run-1' }, event } as never, index + 1)),
		)

		expect(mapped.map(event => event.event)).toEqual([
			'response.created',
			'response.in_progress',
			'response.output_json.delta',
			'response.output_json.done',
			'response.tool_call.started',
			'response.tool_call.completed',
			'response.model_embedding.completed',
			'response.model_rerank.completed',
			'response.in_progress',
			'response.output_json.delta',
			'error',
			'response.completed',
			'error',
		])
		expect(mapped[10]?.data).toMatchObject({
			error: {
				code: 'STREAM_OVERFLOW',
				retriable: true,
			},
		})
	})

	it('routes stream execution failures to the writer fail path', async () => {
		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify')
			.addOutputSchema(z.object({ priority: z.literal('high') }))
			.setRunFunction(async () => ({ priority: 'low' }) as never)
			.getDefinition()
		const executor = createAgentExecutor({
			definition,
			manifest: definition.manifest,
			models: {},
		})
		const fail = vi.fn(async (error: unknown) => {
			throw error
		})

		await expect(
			executor.executeStream({
				appContext: { message: { id: 'msg-1' } },
				message: { id: 'msg-1' },
				payload: {},
				parameter: {},
				writer: {
					write: async () => undefined,
					close: async () => undefined,
					fail,
					onCancel: () => undefined,
				},
			}),
		).rejects.toThrow(/output validation failed/i)
		expect(fail).toHaveBeenCalledOnce()
		await executor.shutdown()
	})

	it('propagates success event emit failures after validating output', async () => {
		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify')
			.addOutputSchema(z.object({ priority: z.literal('high') }))
			.setSuccessEventName('support.triage.completed')
			.setRunFunction(async () => ({ priority: 'high' }))
			.getDefinition()
		const emit = vi.fn(async () => {
			throw new Error('event bridge down')
		})
		const executor = createAgentExecutor({
			definition,
			manifest: definition.manifest,
			models: {},
		})

		await expect(
			executor.executeAggregate({
				appContext: { emit },
				message: { id: 'msg-1' },
				payload: {},
				parameter: {},
			}),
		).rejects.toThrow(/event bridge down/)
		expect(emit).toHaveBeenCalledWith('support.triage.completed', { priority: 'high' })
		await executor.shutdown()
	})
})

function createEventBridgeMock() {
	return new DefaultEventBridge()
}

function createQueueBridgeMock() {
	return new DefaultQueueBridge()
}

describe('testing helpers', () => {
	it('forwards harness logs and child bindings into PURISTA logger methods', () => {
		const childLogger = {
			trace: vi.fn(),
			debug: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
			fatal: vi.fn(),
			getChildLogger: vi.fn(),
		}
		const puristaLogger = {
			trace: vi.fn(),
			debug: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
			fatal: vi.fn(),
			getChildLogger: vi.fn(() => childLogger),
		}
		childLogger.getChildLogger.mockReturnValue(childLogger)

		const logger = createPuristaHarnessLogger(puristaLogger as never)
		logger.info('started')
		logger.warn('with fields', { runId: 'run-1' })
		logger.child({ agent: 'triage', run: 'run-1' }).error('failed')

		expect(puristaLogger.info).toHaveBeenCalledWith('started')
		expect(puristaLogger.warn).toHaveBeenCalledWith({ runId: 'run-1' }, 'with fields')
		expect(puristaLogger.getChildLogger).toHaveBeenCalledWith({ module: 'agent:triage,run:run-1' })
		expect(childLogger.error).toHaveBeenCalledWith('failed')
		expect(createPuristaHarnessLogger().child({}).debug('ignored')).toBeUndefined()
	})

	it('normalizes harness OpenTelemetry ids to PURISTA field names', () => {
		const puristaLogger = {
			trace: vi.fn(),
			debug: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
			fatal: vi.fn(),
			getChildLogger: vi.fn(),
		}

		const logger = createPuristaHarnessLogger(puristaLogger as never)

		logger.error('failed', {
			trace_id: 'legacy-trace-id',
			span_id: 'legacy-span-id',
			trace_flags: 1,
			run_id: 'run-1',
		})

		expect(puristaLogger.error).toHaveBeenCalledWith(
			{
				traceId: 'legacy-trace-id',
				spanId: 'legacy-span-id',
				traceFlags: 1,
				run_id: 'run-1',
			},
			'failed',
		)
	})

	it('provide fake model and context helpers without real credentials', async () => {
		const model = createScriptedHarnessModel()
		model.enqueueObject({
			object: { priority: 'low' },
			usage,
			finishReason: 'stop',
		})

		const response = await model.object({
			model: 'fake-object',
			messages: [],
			schema: {},
			signal: new AbortController().signal,
		})

		expect(response.object).toEqual({ priority: 'low' })

		const fallbackText = await model.text({
			model: 'fake-text',
			messages: [],
			signal: new AbortController().signal,
		})
		const fallbackEmbedding = await model.embed({
			model: 'fake-embedding',
			input: ['one', 'two'],
			signal: new AbortController().signal,
		})
		const fallbackRerank = await model.rerank({
			model: 'fake-rerank',
			query: 'priority',
			documents: [
				{ id: 'doc-1', text: 'one' },
				{ id: 'doc-2', text: 'two' },
			],
			topN: 1,
			signal: new AbortController().signal,
		})

		expect(fallbackText.content).toBe('')
		expect(fallbackEmbedding.embeddings).toHaveLength(2)
		expect(fallbackRerank.results).toHaveLength(1)

		const context = createAgentContextMock({
			payload: { ticketId: 'T-1' },
			parameter: {},
		})
		expect(context.payload).toEqual({ ticketId: 'T-1' })
	})

	it('keeps the internal context helper off the public testing boundary', () => {
		const context = createAgentHandlerContext({
			payload: { ticketId: 'T-1' },
			parameter: {},
			identity: {
				transportMessageId: 'msg-1',
				serviceName: 'support',
				serviceVersion: '1',
				agentName: 'triage',
				runtimeRevision: 'rev-1',
				runId: 'run-1',
				harnessSessionId: 'session-1',
			},
			appContext: {
				message: { id: 'msg-1' },
				resources: { repository: { id: 'repo-1' } },
				emit: async () => undefined,
				service: { 'inventory.1.reserve': { call: async () => ({ reserved: true }) } },
				stream: {},
				queue: {},
			},
			session: createAgentContextMock().harness.session,
			models: {},
			serviceName: 'support',
			emitEvent: async () => undefined,
			logger: createAgentContextMock().logger,
			signal: new AbortController().signal,
		})

		expect(context.resources).toEqual({ repository: { id: 'repo-1' } })
		expect(context.message).toEqual({ id: 'msg-1' })
		expect(context.emit).toBe(context.emit)
		expect(context.service).toEqual({ 'inventory.1.reserve': { call: expect.any(Function) } })
		expect(context.stream).toEqual({})
		expect(context.queue).toEqual({})
		expect(testingExports).not.toHaveProperty('createAgentHandlerContext')
	})

	it('runs custom agent definitions through the test harness', async () => {
		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify')
			.addPayloadSchema(z.object({ ticketId: z.string() }))
			.addOutputSchema(z.object({ priority: z.literal('high') }))
			.addModel('primary', { model: 'fake-object', capabilities: ['object'] as const })
			.setRunFunction(async context => ({ priority: context.payload.ticketId === 'T-1' ? 'high' : 'high' }))
			.getDefinition()

		const harness = createAgentTestHarness(definition, {
			models: {
				primary: {
					provider: createScriptedHarnessModel(),
					model: 'fake-object',
					capabilities: ['object'],
				},
			},
		})

		await expect(harness.run({ payload: { ticketId: 'T-1' }, message: { id: 'msg-1' } })).resolves.toEqual({
			priority: 'high',
		})
	})

	it('rejects invalid final output from the test harness', async () => {
		const definition = await new AgentQueueBuilder('support', '1', 'triage', 'Classify')
			.addOutputSchema(z.object({ priority: z.literal('high') }))
			.addModel('primary', { model: 'fake-object', capabilities: ['object'] as const })
			.setRunFunction(async () => ({ priority: 'low' }) as never)
			.getDefinition()

		const harness = createAgentTestHarness(definition, {
			models: {
				primary: {
					provider: createScriptedHarnessModel(),
					model: 'fake-object',
					capabilities: ['object'],
				},
			},
		})

		await expect(harness.run({ message: { id: 'msg-1' } })).rejects.toThrow(/output validation failed/i)
	})
})
