import { inMemoryDurableWorkspace, inMemoryHarnessStorage, inMemorySandbox, type SandboxScope } from '@purista/harness'
import { vi } from 'vitest'
import { z } from 'zod'

import {
	AgentQueueBuilder,
	createAgentSkillTestRuntime,
	createAgentTestHarness,
	createScriptedHarnessModel,
	ServiceBuilder,
	type ServiceInfoType,
} from '../index.js'
import {
	createAgentRuntimeScope,
	getScopedAgentRuntime,
	initializeAttachedAgentRuntimes,
} from './runtime/scopedRuntime.js'
import { agentSseEventSchema } from './runtime/sseEvents.js'

function trackedSandbox() {
	const adapter = inMemorySandbox()
	const releasedScopes: SandboxScope[] = []
	const originalOpen = adapter.open.bind(adapter)
	const open = vi.spyOn(adapter, 'open').mockImplementation(async options => {
		const opened = await originalOpen(options)
		const close = opened.session.close.bind(opened.session)
		vi.spyOn(opened.session, 'close').mockImplementation(async () => {
			await close()
			releasedScopes.push(options.scope)
		})
		return opened
	})
	return { adapter, open, releasedScopes, terminate: vi.spyOn(adapter, 'terminate') }
}

describe('AgentQueueBuilder', () => {
	const serviceInfo: ServiceInfoType = {
		serviceName: 'support',
		serviceVersion: '1',
		serviceDescription: 'Support service',
	}

	it('is available from ServiceBuilder and expands attached agents into core definitions', async () => {
		const service = new ServiceBuilder(serviceInfo)
		const agent = service.getAgentQueueBuilder('triageTicket', 'Triage a support ticket')

		expect(agent).toBeInstanceOf(AgentQueueBuilder)

		const definition = await agent.setRunFunction(async () => ({ priority: 'normal' })).getDefinition()
		service.addAgentDefinition(definition)

		const resolved = await service.resolveDefinitions()

		expect(resolved.queues).toHaveLength(1)
		expect(resolved.queueWorkers).toHaveLength(1)
		expect(resolved.commands).toHaveLength(1)
		expect(resolved.streams).toHaveLength(1)
		expect(resolved.queues[0].queueName).toBe('agent:support:1:triageTicket')
		expect(resolved.queueWorkers[0].queueName).toBe(resolved.queues[0].queueName)
		expect(resolved.commands[0].commandName).toBe('triageTicket')
		expect(resolved.streams[0].streamName).toBe('triageTicketStream')
	})

	it('requires a Harness agent to use a model alias declared earlier in the fluent chain', () => {
		if (false) {
			const modelRequirementBuilder = new ServiceBuilder(serviceInfo).getAgentQueueBuilder(
				'typedModelRequirementInvalid',
				'Checks model requirements',
			)
			modelRequirementBuilder.addModel('primary', {
				// @ts-expect-error concrete model identifiers are supplied by ai.models at service composition
				model: 'gpt-5-mini',
				capabilities: ['object'],
			})

			const undeclaredModelBuilder = new ServiceBuilder(serviceInfo).getAgentQueueBuilder(
				'typedTriageInvalid',
				'Checks model aliases',
			)
			// @ts-expect-error the model alias must be declared with addModel before setHarnessAgent
			undeclaredModelBuilder.setHarnessAgent({ model: 'primary', instructions: 'Classify the input.' })
		}

		new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('typedTriage', 'Checks model aliases')
			.addModel('primary', { capabilities: ['object'] as const })
			.setHarnessAgent({ model: 'primary', instructions: 'Classify the input.' })
	})

	it('requires each declared model alias to state at least one capability', () => {
		expect(() =>
			new ServiceBuilder(serviceInfo)
				.getAgentQueueBuilder('emptyModelRequirement', 'Rejects an empty capability contract')
				.addModel('primary', { capabilities: [] }),
		).toThrow('model capabilities must contain at least one capability')
	})

	it('injects the deployment-selected model through the runtime binding', async () => {
		const provider = createScriptedHarnessModel()
		provider.enqueueObject({
			object: { priority: 'high' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('runtimeSelectedModel', 'Uses the deployment-selected model')
			.addPayloadSchema(z.object({ ticket: z.string() }))
			.addOutputSchema(z.object({ priority: z.literal('high') }))
			.addModel('primary', { capabilities: ['object'] as const })
			.setHarnessAgent({
				model: 'primary',
				instructions: 'Classify the ticket.',
				input: z.object({ ticket: z.string() }),
				output: z.object({ priority: z.literal('high') }),
				builtinTools: false,
			})
			.getDefinition()

		const harness = await createAgentTestHarness(definition, {
			models: {
				primary: {
					provider,
					model: 'deployment-selected-model',
					capabilities: ['object'],
				},
			},
		})

		await expect(harness.run({ payload: { ticket: 'SUP-123' } })).resolves.toEqual({ priority: 'high' })
		expect(provider.requests).toEqual([expect.objectContaining({ model: 'deployment-selected-model' })])
	})

	it('rejects response-mode options that do not apply to the selected delivery contract', () => {
		const builder = new ServiceBuilder(serviceInfo).getAgentQueueBuilder('responseModeValidation', 'Validates response modes')

		expect(() => builder.setResponseMode('event', { statusUrl: '/jobs/{jobId}' })).toThrow(
			'statusUrl is supported only by accepted and status response modes',
		)
		expect(() => builder.setResponseMode('accepted', { streamUrl: '/jobs/{jobId}/events' })).toThrow(
			'streamUrl is supported only by the stream response mode',
		)
		expect(() => builder.setResponseMode('accepted', { successEventName: 'support.ticket.completed' })).toThrow(
			'Result event names require an event or state-and-event result policy',
		)
		expect(() => builder.setResponseMode('accepted', { delivery: 'required' })).toThrow(
			'Result retention and delivery require a result policy',
		)
		expect(() => builder.setResponseMode('accepted', { statusUrl: '/jobs/{jobId}' })).not.toThrow()
	})

	it('rejects invalid attached-agent capability declarations before runtime initialization', () => {
		const builder = new ServiceBuilder(serviceInfo).getAgentQueueBuilder('capabilityValidation', 'Validates capability declarations')

		expect(() => builder.useSkills([])).toThrow('at least one skill name is required')
		expect(() => builder.useSkills([''])).toThrow('skill name must be a non-empty string')
		expect(() => builder.useSkills(['incident-response'], '')).toThrow('skill resource name must be a non-empty string')
		expect(() => builder.useBuiltInTools('read' as never)).toThrow('built-in tools must be false or an array of tool names')
		expect(() => builder.canInvoke('', '1', 'getTicket')).toThrow('command tool service name must be a non-empty string')
		expect(() => builder.canInvoke('support', '', 'getTicket')).toThrow('command tool service version must be a non-empty string')
		expect(() => builder.canInvoke('support', '1', '')).toThrow('command tool name must be a non-empty string')
		expect(() => builder.canInvokeAgent('', '1')).toThrow('agent tool name must be a non-empty string')
		expect(() => builder.canInvokeAgent('summarize', '')).toThrow('agent tool service version must be a non-empty string')
	})

	it('validates session and workspace policies before definition generation', () => {
		const builder = new ServiceBuilder(serviceInfo).getAgentQueueBuilder('persistenceValidation', 'Validates persistence policies')

		expect(() => builder.setSessionPolicy({ mode: 'conversation', payloadPath: [] })).toThrow(
			'Agent conversation sessions require a non-empty payloadPath',
		)
		expect(() => builder.setSessionPolicy({ mode: 'conversation', payloadPath: [''] })).toThrow(
			'conversation payloadPath segment must be a non-empty string',
		)
		expect(() => builder.setSessionPolicy({ mode: 'unknown' } as never)).toThrow('unsupported agent session mode "unknown"')
		expect(() => builder.setWorkspacePolicy({ mode: 'temporary' } as never)).toThrow(
			'unsupported agent workspace mode "temporary"',
		)
		expect(() => builder.setWorkspacePolicy({ mode: 'durable', capabilities: [''] })).toThrow(
			'workspace capability must be a non-empty string',
		)
		expect(() => builder.setSessionPolicy({ mode: 'conversation', payloadPath: ['conversationId'] })).not.toThrow()
		expect(() => builder.setWorkspacePolicy({ mode: 'durable' })).not.toThrow()
	})

	it('keeps HTTP exposure explicit when public metadata is selected first', async () => {
		const privateDefinition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('notExposed', 'Does not create an endpoint implicitly')
			.makeEndpointPublic()
			.setRunFunction(async () => ({ status: 'ok' }))
			.getDefinition()
		const privateCommand = privateDefinition.command as unknown as { metadata: { expose: unknown } }
		const privateStream = privateDefinition.stream as unknown as { metadata: { expose: unknown } }
		expect(privateCommand.metadata.expose).not.toHaveProperty('http')
		expect(privateStream.metadata.expose).not.toHaveProperty('http')

		const exposedDefinition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('publicEndpoint', 'Keeps explicit endpoint metadata public')
			.makeEndpointPublic()
			.exposeAsHttpEndpoint('POST', 'support/public-endpoint', { streamingMode: 'aggregate' })
			.setRunFunction(async () => ({ status: 'ok' }))
			.getDefinition()
		const exposedCommand = exposedDefinition.command as unknown as { metadata: { expose: unknown } }
		expect(exposedCommand.metadata.expose).toMatchObject({
			http: { method: 'POST', path: 'support/public-endpoint', openApi: { isSecure: false } },
		})
	})

	it('cascades resources, schemas, models, command tools and child agents into handler types', async () => {
		class TicketRepository {
			async load(ticketId: string) {
				return { ticketId, title: 'Printer is offline' }
			}
		}

		const payloadSchema = z.object({ ticketId: z.string() })
		const parameterSchema = z.object({ tenantId: z.string() })
		const outputSchema = z.object({ priority: z.enum(['low', 'normal', 'high']) })
		const commandPayloadSchema = z.object({ id: z.string() })
		const commandParameterSchema = z.object({ includeHistory: z.boolean() })
		const commandOutputSchema = z.object({ status: z.enum(['open', 'closed']) })
		const childPayloadSchema = z.object({ ticketId: z.string() })
		const childParameterSchema = z.object({ tenantId: z.string() })
		const childOutputSchema = z.object({ sentiment: z.enum(['negative', 'neutral', 'positive']) })

		const service = new ServiceBuilder(serviceInfo).defineResource<'repository', TicketRepository>()

		const definition = await service
			.getAgentQueueBuilder('triageTicket', 'Triage a support ticket')
			.addPayloadSchema(payloadSchema)
			.addParameterSchema(parameterSchema)
			.addOutputSchema(outputSchema)
			.defineMetric('app.support.runs', {
				kind: 'counter',
				unit: '{run}',
				description: 'Support agent runs',
			})
			.addModel('primary', { capabilities: ['object'] as const })
			.canInvoke('ticket', '1', 'getTicket', {
				outputSchema: commandOutputSchema,
				payloadSchema: commandPayloadSchema,
				parameterSchema: commandParameterSchema,
			})
			.canInvokeAgent('sentimentAgent', '1', {
				outputSchema: childOutputSchema,
				payloadSchema: childPayloadSchema,
				parameterSchema: childParameterSchema,
			})
			.setRunFunction(async context => {
				const ticketId: string = context.payload.ticketId
				const tenantId: string = context.parameter.tenantId
				context.metrics['app.support.runs'].add(1)
				const loaded = await context.resources.repository.load(ticketId)
				const toolResult: { status: 'open' | 'closed' } = await context.invoke.tools['ticket.1.getTicket'].call(
					{ id: loaded.ticketId },
					{ includeHistory: true },
				)
				const childResult: { sentiment: 'negative' | 'neutral' | 'positive' } = await context.invoke.agents[
					'sentimentAgent.1'
				].run({ ticketId }, { tenantId })

				expectTypeOf(context.harness.models.primary).toHaveProperty('object')
				expectTypeOf(toolResult.status).toEqualTypeOf<'open' | 'closed'>()
				expectTypeOf(childResult.sentiment).toEqualTypeOf<'negative' | 'neutral' | 'positive'>()
				// @ts-expect-error counters do not expose histogram record
				context.metrics['app.support.runs'].record(1)

				return {
					priority: toolResult.status === 'open' && childResult.sentiment === 'negative' ? 'high' : 'normal',
				}
			})
			.getDefinition()

		expect(definition.manifest.models.primary).toEqual({ capabilities: ['object'] })
		expect(definition.manifest.allowedCommands).toHaveLength(1)
		expect(definition.manifest.allowedAgents).toHaveLength(1)
	})

	it('keeps agent-local metrics scoped to that agent handler', async () => {
		const service = new ServiceBuilder(serviceInfo).defineMetric('app.support.requests', {
			kind: 'counter',
			unit: '{request}',
			description: 'Support requests',
		})

		await service
			.getAgentQueueBuilder('triageTicket', 'Triage a support ticket')
			.defineMetric('app.agent.escalations', {
				kind: 'histogram',
				unit: 'ms',
				description: 'Agent escalation duration',
			})
			.setRunFunction(async context => {
				context.metrics['app.support.requests'].add(1)
				context.metrics['app.agent.escalations'].record(12)
				// @ts-expect-error histograms do not expose counter add
				context.metrics['app.agent.escalations'].add(1)
				return { status: 'ok' }
			})
			.getDefinition()

		await service
			.getAgentQueueBuilder('auditTicket', 'Audit a support ticket')
			.setRunFunction(async context => {
				context.metrics['app.support.requests'].add(1)
				// @ts-expect-error agent-local metrics do not cascade to other agents
				context.metrics['app.agent.escalations'].record(12)
				return { status: 'ok' }
			})
			.getDefinition()
	})

	it('carries agent-local metric definitions on the generated definition', async () => {
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('triageTicket', 'Triage a support ticket')
			.defineMetric('app.agent.escalations', {
				kind: 'counter',
				unit: '{escalation}',
				description: 'Escalations',
			})
			.setRunFunction(async () => ({ status: 'ok' }))
			.getDefinition()

		expect(definition.metricDefinitions['app.agent.escalations']).toMatchObject({ kind: 'counter' })
	})

	it('streams harness agent output and resolves the final object', async () => {
		const model = createScriptedHarnessModel()
		model.enqueue({
			object: { status: 'ok' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('streamTriage', 'Streaming triage agent')
			.addModel('primary', { capabilities: ['object', 'tool_use'] as const })
			.addOutputSchema(z.object({ status: z.literal('ok') }))
			.setHarnessAgent({
				model: 'primary',
				input: z.object({}),
				instructions: 'Stream a result.',
				output: z.object({ status: z.literal('ok') }),
			})
			.getDefinition()
		const harness = await createAgentTestHarness(definition, {
			models: { primary: { provider: model, model: 'fake', capabilities: ['object', 'tool_use'] } },
		})

		const { final, chunks } = await harness.stream({ payload: {}, parameter: {} })
		expect(final).toEqual({ status: 'ok' })
		expect(chunks).toContainEqual(
			expect.objectContaining({
				data: expect.objectContaining({
					type: 'response.output_json.delta',
					delta: expect.objectContaining({
						type: 'model.completed',
						modelAlias: 'primary',
						operation: 'object',
						usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
					}),
				}),
			}),
		)
	})

	it('forwards one approval and safe governance evidence through the attached runtime and SSE', async () => {
		const model = createScriptedHarnessModel()
		model.enqueue({
			object: { internal: 'PRIVATE_INTERMEDIATE_CONTENT' },
			toolCalls: [
				{ id: 'write-1', name: 'write', arguments: { path: '/workspace/result.txt', content: 'PRIVATE_TOOL_CONTENT' } },
			],
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'tool_calls',
		})
		model.enqueue({
			object: { status: 'ok' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('approvalTriage', 'Triage with immediate approval')
			.addModel('primary', { capabilities: ['object', 'tool_use'] as const })
			.addOutputSchema(z.object({ status: z.literal('ok') }))
			.setHarnessAgent({
				model: 'primary',
				input: z.object({}),
				instructions: 'Write the approved result.',
				output: z.object({ status: z.literal('ok') }),
				permissions: { write: 'require_approval' },
			})
			.getDefinition()
		const request = vi.fn(async () => ({ decision: 'approved' as const, reasonCode: 'operator_approved' }))
		const audit = vi.fn(async () => undefined)
		const harness = await createAgentTestHarness(definition, {
			models: { primary: { provider: model, model: 'fake', capabilities: ['object', 'tool_use'] } },
			sandbox: inMemorySandbox(),
			governance: {
				policies: [
					{
						kind: 'native',
						id: 'write-policy',
						rules: [{ id: 'review-write', tools: ['write'], effect: 'require_approval', reasonCode: 'write_review' }],
					},
				],
				approval: { request },
				audit: { record: audit },
			},
		})
		const { final, chunks } = await harness.stream({ payload: {}, parameter: {} })
		expect(final).toEqual({ status: 'ok' })
		expect(request).toHaveBeenCalledTimes(1)
		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({
				subject: expect.objectContaining({
					toolId: 'write',
					input: { path: '/workspace/result.txt', content: 'PRIVATE_TOOL_CONTENT' },
				}),
				demands: [expect.objectContaining({ phase: 'permission' }), expect.objectContaining({ phase: 'policy' })],
			}),
			expect.objectContaining({ signal: expect.any(AbortSignal), deadline: expect.any(Number) }),
		)
		const decisionChunks = chunks
			.map(chunk => agentSseEventSchema.parse(chunk))
			.filter(
				chunk =>
					chunk.data.type === 'response.output_json.delta' &&
					typeof chunk.data.delta === 'object' &&
					chunk.data.delta !== null &&
					'type' in chunk.data.delta &&
					['policy.evaluated', 'approval.requested', 'approval.finished', 'model.completed'].includes(
						String(chunk.data.delta.type),
					),
			)
		expect(decisionChunks).toHaveLength(5)
		expect(JSON.stringify(decisionChunks)).not.toContain('PRIVATE_')
		expect(JSON.stringify(audit.mock.calls)).not.toContain('PRIVATE_')
		expect(decisionChunks).toContainEqual(
			expect.objectContaining({
				data: expect.objectContaining({
					delta: expect.objectContaining({
						type: 'approval.finished',
						outcome: 'approved',
						reasonCode: 'operator_approved',
					}),
				}),
			}),
		)
	})

	it('mirrors opted-in run-function model stream chunks with deterministic source metadata', async () => {
		const model = createScriptedHarnessModel()
		model.enqueueTextStream([
			{ kind: 'delta', text: 'he' },
			{ kind: 'delta', text: 'llo' },
			{ kind: 'finish', usage: { inputTokens: 1, outputTokens: 2, totalTokens: 3 }, finishReason: 'stop' },
		])
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('streamText', 'Stream text from a run function')
			.addModel('primary', { capabilities: ['text_stream'] as const })
			.addOutputSchema(z.string())
			.setRunFunction(async context => {
				let text = ''
				for await (const chunk of context.harness.models.primary.textStream(
					{ messages: [{ role: 'user', content: 'hello' }] },
					context.signal,
					{ emitRunEvents: true },
				)) {
					if (chunk.kind === 'delta') text += chunk.text
				}
				return text
			})
			.getDefinition()
		const harness = await createAgentTestHarness(definition, {
			models: { primary: { provider: model, model: 'fake', capabilities: ['text_stream'] } },
		})

		const { final, chunks } = await harness.stream({ payload: {}, parameter: {} })
		const deltas = chunks.filter(
			(chunk): chunk is { data: { type: 'response.output_text.delta'; stream_id: string; delta: string } } =>
				typeof chunk === 'object' &&
				chunk !== null &&
				'data' in chunk &&
				(chunk as { data?: { type?: string } }).data?.type === 'response.output_text.delta',
		)
		const streamId = deltas[0]?.data.stream_id

		expect(final).toBe('hello')
		expect(typeof streamId).toBe('string')
		expect(deltas).toEqual([
			expect.objectContaining({
				data: expect.objectContaining({
					type: 'response.output_text.delta',
					agent_id: 'streamText',
					model_alias: 'primary',
					stream_id: streamId,
					delta: 'he',
				}),
			}),
			expect.objectContaining({
				data: expect.objectContaining({
					type: 'response.output_text.delta',
					agent_id: 'streamText',
					model_alias: 'primary',
					stream_id: streamId,
					delta: 'llo',
				}),
			}),
		])
	})

	it('keeps run-function model stream chunks private by default', async () => {
		const model = createScriptedHarnessModel()
		model.enqueueTextStream([
			{ kind: 'delta', text: 'hidden' },
			{ kind: 'finish', usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 }, finishReason: 'stop' },
		])
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('privateText', 'Consume text privately')
			.addModel('primary', { capabilities: ['text_stream'] as const })
			.addOutputSchema(z.string())
			.setRunFunction(async context => {
				let text = ''
				for await (const chunk of context.harness.models.primary.textStream(
					{ messages: [{ role: 'user', content: 'hello' }] },
					context.signal,
				)) {
					if (chunk.kind === 'delta') text += chunk.text
				}
				return text
			})
			.getDefinition()
		const harness = await createAgentTestHarness(definition, {
			models: { primary: { provider: model, model: 'fake', capabilities: ['text_stream'] } },
		})

		const { final, chunks } = await harness.stream({ payload: {}, parameter: {} })

		expect(final).toBe('hidden')
		expect(chunks).toHaveLength(0)
	})

	it('assigns distinct stream ids for parallel opted-in run-function model streams', async () => {
		const model = createScriptedHarnessModel()
		model.enqueueTextStream([
			{ kind: 'delta', text: 'a' },
			{ kind: 'finish', usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 }, finishReason: 'stop' },
		])
		model.enqueueTextStream([
			{ kind: 'delta', text: 'b' },
			{ kind: 'finish', usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 }, finishReason: 'stop' },
		])
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('parallelText', 'Stream text from parallel run-function calls')
			.addModel('primary', { capabilities: ['text_stream'] as const })
			.addOutputSchema(z.string())
			.setRunFunction(async context => {
				const consume = async (content: string) => {
					let text = ''
					for await (const chunk of context.harness.models.primary.textStream(
						{ messages: [{ role: 'user', content }] },
						context.signal,
						{ emitRunEvents: true },
					)) {
						if (chunk.kind === 'delta') text += chunk.text
					}
					return text
				}
				const [left, right] = await Promise.all([consume('left'), consume('right')])
				return `${left}${right}`
			})
			.getDefinition()
		const harness = await createAgentTestHarness(definition, {
			models: { primary: { provider: model, model: 'fake', capabilities: ['text_stream'] } },
		})

		const { final, chunks } = await harness.stream({ payload: {}, parameter: {} })
		const deltas = chunks.filter(
			(chunk): chunk is { data: { type: 'response.output_text.delta'; stream_id: string; delta: string } } =>
				typeof chunk === 'object' &&
				chunk !== null &&
				'data' in chunk &&
				(chunk as { data?: { type?: string } }).data?.type === 'response.output_text.delta',
		)

		expect(final).toBe('ab')
		expect(deltas.map(chunk => chunk.data.delta).sort()).toEqual(['a', 'b'])
		expect(new Set(deltas.map(chunk => chunk.data.stream_id)).size).toBe(2)
	})

	it('surfaces harness errors from streaming runs instead of masking them as validation failures', async () => {
		const model = createScriptedHarnessModel()
		// No stream response queued: the provider throws, so the run must finish with an error.
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('streamFail', 'Streaming agent that fails')
			.addModel('primary', { capabilities: ['object', 'tool_use'] as const })
			.addOutputSchema(z.object({ status: z.literal('ok') }))
			.setHarnessAgent({
				model: 'primary',
				input: z.object({}),
				instructions: 'Stream a result.',
				output: z.object({ status: z.literal('ok') }),
			})
			.getDefinition()
		const harness = await createAgentTestHarness(definition, {
			models: { primary: { provider: model, model: 'fake', capabilities: ['object', 'tool_use'] } },
		})

		await expect(harness.stream({ payload: {}, parameter: {} })).rejects.toThrow()
	})

	it('produces a stable, change-sensitive runtime revision', async () => {
		const build = (description: string) =>
			new ServiceBuilder(serviceInfo)
				.getAgentQueueBuilder('triageTicket', description)
				.addOutputSchema(z.object({ status: z.literal('ok') }))
				.setRunFunction(async () => ({ status: 'ok' }))
				.getManifest()

		expect(build('same').runtimeRevision).toBe(build('same').runtimeRevision)
		expect(build('one').runtimeRevision).not.toBe(build('two').runtimeRevision)
	})

	it('serializes durable workspace policy into the agent manifest', () => {
		const service = new ServiceBuilder(serviceInfo)
		const input = z.object({ runId: z.string() })
		const output = z.object({ status: z.literal('ok') })
		const manifest = service
			.getAgentQueueBuilder('durableTriage', 'Triage a support ticket with durable workspace replay')
			.addPayloadSchema(input)
			.addOutputSchema(output)
			.setDurability({ mode: 'required', runIdPath: ['runId'] })
			.setWorkspacePolicy({
				mode: 'durable',
				policy: {
					retention: { cleanupMode: 'manual_only' },
				},
			})
			.setHarnessWorkflow({ input, output, handler: async () => ({ status: 'ok' as const }) })
			.getManifest()

		expect(manifest.workspacePolicy).toEqual({
			mode: 'durable',
			capabilities: [
				'storage.workspace_checkpoint',
				'workspace.durable',
				'workspace.checkpoint',
				'workspace.resume',
				'workspace.cleanup',
			],
			policy: {
				retention: { cleanupMode: 'manual_only' },
			},
		})
		expect(manifest.durability).toEqual({ mode: 'required', runIdPath: ['runId'] })
		expect(manifest.runtimeRevision).toMatch(/^rev-/)
	})

	it('forwards durable workspace policy through the public Harness invocation boundary', async () => {
		const input = z.object({ runId: z.string() })
		const output = z.object({ status: z.literal('ok') })
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('durableRuntimePolicy', 'Forwards workspace constraints to Harness')
			.addPayloadSchema(input)
			.addOutputSchema(output)
			.addModel('primary', { capabilities: ['object'] as const })
			.setDurability({ mode: 'required', runIdPath: ['runId'] })
			.setWorkspacePolicy({
				mode: 'durable',
				policy: { retention: { cleanupMode: 'manual_only' } },
			})
			.setHarnessWorkflow({ input, output, handler: async () => ({ status: 'ok' as const }) })
			.getDefinition()
		const workspace = inMemoryDurableWorkspace()
		const startWorkspace = vi.spyOn(workspace, 'startWorkspace')
		const harness = await createAgentTestHarness(definition, {
			models: { primary: { provider: createScriptedHarnessModel(), model: 'fake', capabilities: ['object'] } },
			storage: inMemoryHarnessStorage(),
			workspace,
		})

		try {
			await expect(harness.run({ payload: { runId: 'case-42' }, parameter: {} })).resolves.toEqual({ status: 'ok' })
			expect(startWorkspace).toHaveBeenCalledWith(
				expect.objectContaining({ policy: { retention: { cleanupMode: 'manual_only' } } }),
			)
		} finally {
			await definition.runtime.current?.shutdown()
		}
	})

	it('binds declared skills into a harness agent runtime', async () => {
		const skillRuntime = await createAgentSkillTestRuntime([
			{
				name: 'incident-skill',
				description: 'Use this skill when triaging incidents.',
				body: 'SECRET_BODY',
			},
		])
		const model = createScriptedHarnessModel()
		model.enqueue({
			object: {},
			toolCalls: [{ id: 'read-skill', name: 'read', arguments: { path: '/skills/incident-skill/SKILL.md' } }],
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'tool_calls',
		})
		model.enqueue({
			object: { status: 'ok' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})
		const service = new ServiceBuilder(serviceInfo)
		const definition = await service
			.getAgentQueueBuilder('skillTriage', 'Triage with a runtime skill')
			.addModel('primary', { capabilities: ['object', 'tool_use'] as const })
			.addOutputSchema(z.object({ status: z.literal('ok') }))
			.useSkills(['incident-skill'])
			.setHarnessAgent({
				model: 'primary',
				input: z.object({}),
				instructions: 'Use relevant skills.',
				output: z.object({ status: z.literal('ok') }),
			})
			.getDefinition()
		const scope = createAgentRuntimeScope()
		await initializeAttachedAgentRuntimes(scope, [definition], {
			models: { primary: { provider: model, model: 'fake', capabilities: ['object', 'tool_use'] } },
			skills: skillRuntime.skills,
		})

		const runtime = getScopedAgentRuntime(scope, definition)
		await expect(
			runtime.executeAggregate({
				appContext: {
					resources: {},
					message: { id: 'm1' },
					service: {},
					stream: {},
					queue: {},
					emit: async () => undefined,
				},
				message: { id: 'm1' },
				payload: {},
				parameter: {},
			}),
		).resolves.toEqual({ status: 'ok' })
		const firstRequest = model.requests[0] as { messages?: Array<{ content?: string }> } | undefined
		expect(firstRequest?.messages?.[0]?.content).toContain('Available skills')
		expect(firstRequest?.messages?.[0]?.content).toContain('incident-skill')
		expect(firstRequest?.messages?.[0]?.content).not.toContain('SECRET_BODY')
		await skillRuntime.cleanup()
	})

	it('passes governance config into attached harness agent runtimes', async () => {
		const skillRuntime = await createAgentSkillTestRuntime([
			{
				name: 'incident-skill',
				description: 'Use this skill when triaging incidents.',
				body: 'SECRET_BODY',
			},
		])
		const model = createScriptedHarnessModel()
		model.enqueue({
			object: {},
			toolCalls: [{ id: 'read-skill', name: 'read', arguments: { path: '/skills/incident-skill/SKILL.md' } }],
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'tool_calls',
		})
		model.enqueue({
			object: { status: 'ok' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})
		const auditedDecisions: string[] = []
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('governedSkillTriage', 'Triage with governed skill access')
			.addModel('primary', { capabilities: ['object', 'tool_use'] as const })
			.addOutputSchema(z.object({ status: z.literal('ok') }))
			.useSkills(['incident-skill'])
			.setHarnessAgent({
				model: 'primary',
				input: z.object({}),
				instructions: 'Use relevant skills.',
				output: z.object({ status: z.literal('ok') }),
			})
			.getDefinition()
		const scope = createAgentRuntimeScope()
		await initializeAttachedAgentRuntimes(scope, [definition], {
			models: { primary: { provider: model, model: 'fake', capabilities: ['object', 'tool_use'] } },
			skills: skillRuntime.skills,
			governance: {
				policies: [
					{
						kind: 'native',
						id: 'skill-read-audit',
						rules: [
							{
								id: 'audit-read-tool',
								tools: ['read'],
								effect: 'audit',
							},
						],
					},
				],
				audit: {
					record: async decision => {
						auditedDecisions.push(`${decision.evidence.source.id}:${decision.evidence.source.ruleId}`)
					},
				},
			},
		})

		const runtime = getScopedAgentRuntime(scope, definition)
		await expect(
			runtime.executeAggregate({
				appContext: {
					resources: {},
					message: { id: 'm1' },
					service: {},
					stream: {},
					queue: {},
					emit: async () => undefined,
				},
				message: { id: 'm1' },
				payload: {},
				parameter: {},
			}),
		).resolves.toEqual({ status: 'ok' })
		expect(auditedDecisions).toContain('skill-read-audit:audit-read-tool')
		await skillRuntime.cleanup()
	})

	it('passes scoped sandbox opens and attachment release through createAgentTestHarness', async () => {
		const sandbox = trackedSandbox()
		const model = createScriptedHarnessModel()
		for (const id of ['first', 'second']) {
			model.enqueue({
				object: {},
				toolCalls: [{ id: `write-${id}`, name: 'write', arguments: { path: `/workspace/${id}.txt`, content: id } }],
				usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
				finishReason: 'tool_calls',
			})
			model.enqueue({
				object: { status: 'ok' },
				usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
				finishReason: 'stop',
			})
		}
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('sandboxTriage', 'Triage with a configured sandbox')
			.addModel('primary', { capabilities: ['object', 'tool_use'] as const })
			.addOutputSchema(z.object({ status: z.literal('ok') }))
			.setHarnessAgent({
				model: 'primary',
				input: z.object({}),
				instructions: 'Write the supplied result.',
				output: z.object({ status: z.literal('ok') }),
			})
			.getDefinition()
		const harness = await createAgentTestHarness(definition, {
			models: { primary: { provider: model, model: 'fake', capabilities: ['object', 'tool_use'] } },
			sandbox: sandbox.adapter,
		})
		const input = {
			payload: {},
			parameter: {},
			message: { id: 'sandbox-message', tenantId: 'tenant', principalId: 'principal' },
		}
		try {
			await expect(harness.run(input)).resolves.toEqual({ status: 'ok' })
			await expect(harness.run(input)).resolves.toEqual({ status: 'ok' })
			expect(sandbox.open).toHaveBeenCalledTimes(1)
			expect(model.requests).toHaveLength(2)
			const firstOpen = sandbox.open.mock.calls[0][0]
			expect(firstOpen).toMatchObject({
				mode: 'create',
					scope: {
						owner: {
							namespace: 'support.1.sandboxTriage',
							id: expect.stringMatching(/^agent-session:[0-9a-f]{64}$/),
						instanceId: expect.any(String),
						identity: { tenantId: 'tenant', principalId: 'principal' },
					},
					partition: { kind: 'shared' },
					lifetime: 'session',
				},
			})
			expect(firstOpen.scope).not.toHaveProperty('runId')
			expect(sandbox.releasedScopes).toEqual([firstOpen.scope])
			expect(sandbox.terminate).not.toHaveBeenCalled()
		} finally {
			await definition.runtime.current?.shutdown()
		}
	})

	it.each(['inherit', 'private'] as const)(
		'uses the service sandbox for the %s sharing policy in the test helper',
		async selection => {
			const runtime = trackedSandbox()
			const model = createScriptedHarnessModel()
			model.enqueue({
					object: {},
					toolCalls: [{ id: 'write-selection', name: 'write', arguments: { path: '/workspace/selection.txt', content: selection } }],
					usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
					finishReason: 'tool_calls',
				})
				model.enqueue({
					object: { status: 'ok' },
					usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
					finishReason: 'stop',
			})
			const builder = new ServiceBuilder(serviceInfo)
				.getAgentQueueBuilder('policyTriage', 'Triage with sandbox selection')
				.addModel('primary', { capabilities: ['object', 'tool_use'] as const })
				.addOutputSchema(z.object({ status: z.literal('ok') }))
				.setHarnessAgent({
					model: 'primary',
					input: z.object({}),
					instructions: 'Write the selected sandbox result when a sandbox is configured.',
					output: z.object({ status: z.literal('ok') }),
				})
			if (selection === 'private') {
				builder.setSandboxPolicy({
					sharing: 'private',
				})
			}
			const definition = await builder.getDefinition()
			const harness = await createAgentTestHarness(definition, {
				models: { primary: { provider: model, model: 'fake', capabilities: ['object', 'tool_use'] } },
				sandbox: runtime.adapter,
			})
			try {
				await expect(harness.run({ payload: {}, parameter: {} })).resolves.toEqual({ status: 'ok' })
				expect(runtime.open).toHaveBeenCalledTimes(selection === 'private' ? 2 : 1)
				expect(runtime.releasedScopes).toHaveLength(selection === 'private' ? 2 : 1)
				expect(runtime.terminate).not.toHaveBeenCalled()
			} finally {
				await definition.runtime.current?.shutdown()
			}
		},
	)

	it('keeps explicit owner resolution executable-only and authorizes it through the service binding', async () => {
		const runtime = trackedSandbox()
		const model = createScriptedHarnessModel()
		model.enqueue({
			object: {},
			toolCalls: [{ id: 'write-owner', name: 'write', arguments: { path: '/workspace/owner.txt', content: 'owner' } }],
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'tool_calls',
		})
		model.enqueue({
			object: { status: 'ok' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})
		const owner = {
			namespace: 'support.shared',
			id: 'case-42',
			instanceId: '01M11AXWWA8T83R8CMSK1B3J8N',
			identity: { tenantId: 'tenant-a', principalId: 'principal-a' },
		} as const
		await runtime.adapter.registerOwner({ owner, mode: 'create' })
		const resolveOwner = vi.fn(() => owner)
		const authorizeOwner = vi.fn(() => true)
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('ownerTriage', 'Triage in an explicitly authorized sandbox')
			.addPayloadSchema(z.object({ requestId: z.string() }))
			.addModel('primary', { capabilities: ['object', 'tool_use'] as const })
			.addOutputSchema(z.object({ status: z.literal('ok') }))
			.setSandboxPolicy({ owner: resolveOwner })
			.setHarnessAgent({
				model: 'primary',
				input: z.object({ requestId: z.string() }),
				instructions: 'Write the owner result.',
				output: z.object({ status: z.literal('ok') }),
			})
			.getDefinition()
		expect(definition.manifest.sandbox).toEqual({ usesExplicitOwner: true })
		expect(JSON.stringify(definition.manifest)).not.toContain('support.shared')
		const harness = await createAgentTestHarness(definition, {
			models: { primary: { provider: model, model: 'fake', capabilities: ['object', 'tool_use'] } },
			sandbox: runtime.adapter,
			sandboxOptions: { authorizeOwner },
		})
		try {
			await expect(
				harness.run({
					payload: { requestId: 'request-42', ignored: 'not validated' },
					parameter: {},
					message: { id: 'owner-message', tenantId: 'tenant-a', principalId: 'principal-a' },
				}),
			).resolves.toEqual({ status: 'ok' })
			expect(resolveOwner).toHaveBeenCalledWith(
				expect.objectContaining({
					input: { requestId: 'request-42' },
					identity: expect.objectContaining({ tenantId: 'tenant-a', principalId: 'principal-a' }),
				}),
			)
			expect(authorizeOwner).toHaveBeenCalled()
		} finally {
			await definition.runtime.current?.shutdown()
		}
	})

	it('rejects removed per-agent adapter and enabled settings at the builder boundary', () => {
		const builder = new ServiceBuilder(serviceInfo).getAgentQueueBuilder('policyValidation', 'Validate sandbox policy')
		expect(() => builder.setSandboxPolicy({ enabled: false } as never)).toThrow(/only support sharing and owner/)
		expect(() => builder.setSandboxPolicy({ adapter: inMemorySandbox() } as never)).toThrow(/only support sharing and owner/)
	})

	it('passes runtime skill bindings through createAgentTestHarness', async () => {
		const skillRuntime = await createAgentSkillTestRuntime([
			{
				name: 'incident-skill',
				description: 'Use this skill when triaging incidents.',
				body: 'SECRET_BODY',
			},
		])
		const model = createScriptedHarnessModel()
		model.enqueue({
			object: {},
			toolCalls: [{ id: 'read-skill', name: 'read', arguments: { path: '/skills/incident-skill/SKILL.md' } }],
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'tool_calls',
		})
		model.enqueue({
			object: { status: 'ok' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('skillTriage', 'Triage with a runtime skill')
			.addModel('primary', { capabilities: ['object', 'tool_use'] as const })
			.addOutputSchema(z.object({ status: z.literal('ok') }))
			.useSkills(['incident-skill'])
			.setHarnessAgent({
				model: 'primary',
				input: z.object({}),
				instructions: 'Use relevant skills.',
				output: z.object({ status: z.literal('ok') }),
			})
			.getDefinition()
		const harness = await createAgentTestHarness(definition, {
			models: { primary: { provider: model, model: 'fake', capabilities: ['object', 'tool_use'] } },
			skills: skillRuntime.skills,
		})

		await expect(harness.run({ payload: {}, parameter: {} })).resolves.toEqual({ status: 'ok' })
		const firstRequest = model.requests[0] as { messages?: Array<{ content?: string }> } | undefined
		expect(firstRequest?.messages?.[0]?.content).toContain('Available skills')
		expect(firstRequest?.messages?.[0]?.content).not.toContain('SECRET_BODY')
		await skillRuntime.cleanup()
	})

	it('registers harness-local agents for wrapped harness workflows', async () => {
		const model = createScriptedHarnessModel()
		model.enqueue({
			object: { summary: 'Checkout outage risk is high.' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})
		const input = z.object({ incident: z.string() })
		const output = z.object({ summary: z.string() })
		const summarizeAgent = {
			model: 'primary',
			input,
			output,
			builtinTools: false as const,
			instructions: 'Summarize the incident.',
		}
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('incidentReview', 'Reviews an incident with a harness workflow')
			.addModel('primary', { capabilities: ['object'] as const })
			.addPayloadSchema(input)
			.addOutputSchema(output)
			.setHarnessWorkflow(
				{
					input,
					output,
					handler: async context => {
						return context.agents.summarize({ incident: context.input.incident })
					},
				},
				{ agents: { summarize: summarizeAgent } },
			)
			.getDefinition()
		const harness = await createAgentTestHarness(definition, {
			models: { primary: { provider: model, model: 'fake', capabilities: ['object'] } },
		})

		await expect(harness.run({ payload: { incident: 'Checkout is down' }, parameter: {} })).resolves.toEqual({
			summary: 'Checkout outage risk is high.',
		})
	})

	it('lets an application acknowledge an external-wait suspension with typed waiting output', async () => {
		const input = z.object({ paymentId: z.string() })
		const output = z.object({ status: z.literal('waiting') })
		const definition = await new ServiceBuilder(serviceInfo)
			.getAgentQueueBuilder('paymentReview', 'Durable payment review')
			.addModel('primary', { capabilities: ['object'] as const })
			.addPayloadSchema(input)
			.addOutputSchema(output)
			.setDurability({ mode: 'required', runIdPath: ['paymentId'] })
			.setHarnessWorkflow({
				input,
				output,
				handler: async () => {
					const error = new Error('waiting') as Error & {
						snapshot: { waitId: string; kind: string; status: 'waiting' }
					}
					error.name = 'ExternalWaitPendingError'
					error.snapshot = { waitId: 'review:payment-1', kind: 'human_review', status: 'waiting' }
					throw error
				},
			})
			.getDefinition()
		const notices: string[] = []
		const harness = await createAgentTestHarness(definition, {
			models: { primary: { provider: createScriptedHarnessModel(), model: 'fake', capabilities: ['object'] } },
			onSuspended: notice => {
				notices.push(`${notice.runId}:${notice.wait.waitId}`)
				return { status: 'waiting' }
			},
		})

		await expect(harness.run({ payload: { paymentId: 'payment-1' }, parameter: {} })).resolves.toEqual({
			status: 'waiting',
		})
		expect(notices[0]).toMatch(/^agent-run:[0-9a-f]{64}:review:payment-1$/)
	})

	it('creates namespaced skill bindings for skill-backed agent tests', async () => {
		const skillRuntime = await createAgentSkillTestRuntime([
			{
				name: 'incident-skill',
				resourceName: 'incident-response-skills',
				description: 'Use this skill when triaging incidents.',
			},
		])
		expect(skillRuntime.skills.namespaces?.['incident-response-skills']?.['incident-skill']).toBeDefined()
		expect(skillRuntime.skills.bindings?.['incident-skill']).toBeUndefined()
		await skillRuntime.cleanup()
	})
})
