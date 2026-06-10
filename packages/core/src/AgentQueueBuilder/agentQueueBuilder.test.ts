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
			.addModel('primary', { model: 'test-model', capabilities: ['object'] as const })
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

		expect(definition.manifest.models.primary.model).toBe('test-model')
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
			.addModel('primary', { model: 'fake', capabilities: ['object', 'tool_use'] as const })
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
		expect(chunks.length).toBeGreaterThan(0)
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
			.addModel('primary', { model: 'fake', capabilities: ['text_stream'] as const })
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
			.addModel('primary', { model: 'fake', capabilities: ['text_stream'] as const })
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
			.addModel('primary', { model: 'fake', capabilities: ['text_stream'] as const })
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
			.addModel('primary', { model: 'fake', capabilities: ['object', 'tool_use'] as const })
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
		const manifest = service
			.getAgentQueueBuilder('durableTriage', 'Triage a support ticket with durable workspace replay')
			.setWorkspacePolicy({
				mode: 'durable',
				policy: {
					retention: { cleanupMode: 'manual_only' },
				},
			})
			.setRunFunction(async () => ({ status: 'ok' }))
			.getManifest()

		expect(manifest.workspacePolicy).toEqual({
			mode: 'durable',
			required: true,
			capabilities: [
				'runtime.workspace_checkpoint',
				'workspace_store.durable',
				'workspace_store.checkpoint',
				'workspace_store.resume',
				'workspace_store.cleanup',
			],
			cleanup: 'on_terminal',
			policy: {
				retention: { cleanupMode: 'manual_only' },
			},
		})
		expect(manifest.runtimeRevision).toMatch(/^rev-/)
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
			.addModel('primary', { model: 'fake', capabilities: ['object', 'tool_use'] as const })
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
			.addModel('primary', { model: 'fake', capabilities: ['object', 'tool_use'] as const })
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
