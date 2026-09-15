import { defineAgent, defineHarness, defineWorkflow, harnessExecutionEventTypesV1 } from '@purista/harness'
import { FakeModelProvider, objectReply } from '@purista/harness/testing'
import { createSandbox } from 'sinon'
import { z } from 'zod'
import { EBMessageType, Service } from '../core/index.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import { DefaultEventBridge } from '../DefaultEventBridge/DefaultEventBridge.impl.js'
import { createHarnessInvocationProxy } from '../HarnessMount/invocation.js'
import {
	computeHarnessTargetExportDigest,
	createGeneratedHarnessSchema,
	createRemoteHarnessTargetContract,
} from '../HarnessMount/remoteTargetContract.js'
import { getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
import { getCommandMessageMock } from '../mocks/messages/getCommandMessage.mock.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { StreamDefinitionBuilder } from './StreamDefinitionBuilder.impl.js'

function createRemoteTarget<const Kind extends 'agent' | 'workflow', const Id extends string>(kind: Kind, id: Id) {
	const schema = { type: 'string' } as const
	const address = { serviceName: 'RemoteAi', serviceVersion: '2', serviceTarget: id } as const
	const target = {
		targetName: id,
		kind,
		inputSchema: schema,
		validatedInputSchema: schema,
		outputSchema: schema,
		updateSchema: false as const,
		interruptSchema: false as const,
		invocation: { aggregate: true as const, stream: true as const, resumableInterrupts: [] as const },
		stream: {
			protocol: 'harness-execution-events-v1' as const,
			eventTypes: harnessExecutionEventTypesV1,
			outputUpdates: [] as const,
		},
	}
	return createRemoteHarnessTargetContract({
		schemaVersion: 1,
		address,
		target: { ...target, exportDigest: computeHarnessTargetExportDigest({ address, target }) },
		schemas: {
			input: createGeneratedHarnessSchema<string>(schema),
			validatedInput: createGeneratedHarnessSchema<string>(schema),
			output: createGeneratedHarnessSchema<string>(schema),
		},
	})
}

describe('StreamDefinitionBuilder', () => {
	const sandbox = createSandbox()

	const service = new Service({
		info: {
			serviceName: 'TestService',
			serviceVersion: '1',
			serviceDescription: 'A service',
		},
		commandDefinitionList: [],
		subscriptionDefinitionList: [],
		streamDefinitionList: [],
		logger: getLoggerMock(sandbox).mock,
		eventBridge: getEventBridgeMock(sandbox).mock,
		config: {},
	})

	afterAll(() => {
		sandbox.restore()
	})

	it('provides default aggregated final schema when enabled and no final schema was set', async () => {
		const builder = new StreamDefinitionBuilder('searchUsers', 'stream users')
			.addPayloadSchema(z.object({ search: z.string() }))
			.addParameterSchema(z.object({ page: z.number().default(1) }))
			.addChunkSchema(z.object({ id: z.string() }))
			.enableChunkAggregation(true)
			.setStreamFunction(async function (_context, _payload, _parameter, writer) {
				await writer.write({ id: 'u1' })
				await writer.close()
			})

		const streamFunction = builder.getStreamFunction()
		expect(streamFunction).toBeTypeOf('function')

		const definition = await builder.getDefinition()
		expect(definition.streamName).toBe('searchUsers')
		expect(definition.finalSchema).toBeUndefined()
		expect(definition.metadata.expose.finalPayload).toMatchObject({
			type: 'object',
			properties: {
				chunkCount: { type: 'number' },
				chunks: {
					type: 'array',
				},
			},
			required: ['chunkCount', 'chunks'],
		})
	})

	it('uses explicit final schema and event name when configured', async () => {
		const builder = new StreamDefinitionBuilder('searchUsers', 'stream users')
			.addPayloadSchema(z.object({ search: z.string() }))
			.addParameterSchema(z.object({ page: z.number().default(1) }))
			.addChunkSchema(z.object({ id: z.string() }))
			.addFinalSchema(z.object({ ids: z.array(z.string()) }))
			.setFinalEventName('user.search.completed')
			.enableChunkAggregation(false)
			.setStreamFunction(async function (_context, _payload, _parameter, writer) {
				await writer.close({ ids: ['u1'] })
			})

		const definition = await builder.getDefinition()
		expect(definition.finalEventName).toBe('user.search.completed')
		expect(definition.aggregateChunks).toBe(false)
		expect(definition.metadata.expose.finalPayload).toMatchObject({
			type: 'object',
			properties: {
				ids: {
					type: 'array',
				},
			},
		})
	})

	it('can execute stream function against a concrete service instance', async () => {
		const builder = new StreamDefinitionBuilder('searchUsers', 'stream users').setStreamFunction(
			async function (_context, _payload, _parameter, writer) {
				await writer.close()
			},
		)
		const fn = builder.getStreamFunction().bind(service)

		await expect(
			fn(
				{
					message: {} as never,
					service: {},
					stream: {},
					emit: async () => undefined,
					resources: {},
				} as never,
				{},
				{},
				{
					cancelled: false,
					write: async () => undefined,
					close: async () => undefined,
					fail: async () => undefined,
					onCancel: () => undefined,
				},
			),
		).resolves.toBeUndefined()
	})

	it('adds http/openapi metadata and invoke declarations to stream definition', async () => {
		const builder = new StreamDefinitionBuilder('searchUsers', 'stream users')
			.addPayloadSchema(z.object({ search: z.string() }), 'application/json', 'utf-8')
			.addParameterSchema(z.object({ page: z.number() }))
			.addChunkSchema(z.object({ id: z.string() }), false)
			.addFinalSchema(z.object({ ids: z.array(z.string()) }), false)
			.canInvoke(
				'AuditService',
				'1',
				'writeAudit',
				z.object({ ok: z.boolean() }),
				z.object({ id: z.string() }),
				z.object({}),
			)
			.canConsumeStream(
				'SearchService',
				'1',
				'searchUsers',
				z.object({ id: z.string() }),
				z.object({ q: z.string() }),
				z.object({ page: z.number() }),
				z.object({ ids: z.array(z.string()) }),
			)
			.canEmit('user.search.completed', z.object({ ids: z.array(z.string()) }))
			.exposeAsHttpStreamEndpoint('POST', '/search-users')
			.makeEndpointPublic()
			.enableHttpSecurity(false)
			.setOpenApiSummary('Search users stream')
			.setOpenApiOperationId('searchUsersStream')
			.addOpenApiTags('search', 'users')
			.addOpenApiErrorStatusCodes(StatusCode.BadRequest, StatusCode.Unauthorized)
			.addQueryParameters({
				name: 'page',
				required: false,
			})
			.setStreamFunction(async function (_context, _payload, _parameter, writer) {
				await writer.close({ ids: [] })
			})

		const definition = await builder.getDefinition()
		expect(definition.metadata.expose.http).toMatchObject({
			method: 'POST',
			path: '/search-users',
			openApi: {
				description: 'stream users',
				summary: 'Search users stream',
				operationId: 'searchUsersStream',
				isSecure: false,
			},
		})
		expect(definition.chunkValidationEnabled).toBe(false)
		expect(definition.finalValidationEnabled).toBe(false)
		expect(definition.invokes.AuditService['1'].writeAudit).toBeDefined()
		expect(definition.streamInvokes.SearchService['1'].searchUsers).toBeDefined()
		expect(definition.emitList['user.search.completed']).toBeDefined()
	})

	it('throws when stream function is missing', () => {
		const builder = new StreamDefinitionBuilder('searchUsers', 'stream users')
		expect(() => builder.getStreamFunction()).toThrow('No function implementation for searchUsers')
	})

	it('supports aggregate HTTP response mode for streams', async () => {
		const definition = await new StreamDefinitionBuilder('aggregate', 'aggregate stream')
			.exposeAsHttpStreamEndpoint('GET', '/aggregate')
			.setHttpStreamingMode('aggregate')
			.setStreamFunction(async function (_context, _payload, _parameter, writer) {
				await writer.close({ done: true })
			})
			.getDefinition()

		expect(definition.metadata.expose.contentTypeResponse).toBe('application/json')
		expect(definition.metadata.expose.http?.stream?.mode).toBe('aggregate')
	})

	it('configures a protocol stream for direct output without chunk aggregation', async () => {
		const definition = await new StreamDefinitionBuilder('aiChat', 'AI SDK chat stream')
			.exposeAsHttpStreamEndpoint('POST', '/chat')
			.setHttpStreamProtocol('ai-sdk-ui-message-stream-v1')
			.setStreamFunction(async function (_context, _payload, _parameter, writer) {
				await writer.close()
			})
			.getDefinition()

		expect(definition.metadata.expose.http?.stream).toMatchObject({
			protocol: 'ai-sdk-ui-message-stream-v1',
			mode: 'stream',
		})
		expect(definition.aggregateChunks).toBe(false)
		expect(definition.metadata.expose.finalPayload).toBeUndefined()
	})

	it('stores custom response headers with stream protocol metadata', async () => {
		const definition = await new StreamDefinitionBuilder('custom', 'custom protocol stream')
			.exposeAsHttpStreamEndpoint('POST', '/custom')
			.setHttpStreamProtocol('custom-v1')
			.setHttpResponseHeaders({ 'x-custom-protocol': 'v1' })
			.setStreamFunction(async function (_context, _payload, _parameter, writer) {
				await writer.close()
			})
			.getDefinition()

		expect(definition.metadata.expose.http?.stream).toMatchObject({
			responseHeaders: { 'x-custom-protocol': 'v1' },
		})
	})

	it('rejects invalid and transport-owned stream response headers', () => {
		const builder = new StreamDefinitionBuilder('aiChat', 'AI SDK chat stream')
		expect(() => builder.setHttpResponseHeaders({ 'content-type': 'text/plain' })).toThrow(/managed by the server/)
		expect(() => builder.setHttpResponseHeaders({ 'x-invalid': 'line one\nline two' })).toThrow(/Invalid HTTP/)
	})

	it('stores and exposes stream guard hooks by name', () => {
		const beforeGuard = vi.fn(async function beforeGuard() {})
		const afterGuard = vi.fn(async function afterGuard() {})

		const builder = new StreamDefinitionBuilder('guardedStream', 'guarded stream')
			.setBeforeGuardHooks({ auth: beforeGuard })
			.setAfterGuardHooks({ audit: afterGuard })

		expect(builder.getBeforeGuardHook('auth')).toBe(beforeGuard)
		expect(builder.getAfterGuardHook('audit')).toBe(afterGuard)
	})

	it('executes stream before and after guard hooks during runtime', async () => {
		const events: string[] = []
		const builder = new StreamDefinitionBuilder('guardedRuntime', 'guarded runtime stream')
			.addPayloadSchema(z.object({ prompt: z.string() }))
			.addFinalSchema(z.object({ answer: z.string() }))
			.setBeforeGuardHooks({
				auth: async function (_context, payload) {
					events.push(`before:${payload.prompt}`)
				},
			})
			.setAfterGuardHooks({
				audit: async function (_context, result) {
					events.push(`after:${String(result?.answer ?? '')}`)
				},
			})
			.setStreamFunction(async function (_context, payload, _parameter, writer) {
				events.push(`handler:${payload.prompt}`)
				await writer.close({ answer: 'ok' })
			})

		const definition = await builder.getDefinition()
		await service.registerStream(definition)
		await service.executeStream({
			id: 'stream-open-1',
			correlationId: 'corr-1',
			timestamp: Date.now(),
			traceId: 'trace-1',
			messageType: EBMessageType.Stream,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			principalId: 'principal',
			tenantId: 'tenant',
			sender: {
				serviceName: 'Client',
				serviceVersion: '1',
				serviceTarget: 'open',
				instanceId: 'client-1',
			},
			receiver: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceTarget: 'guardedRuntime',
				instanceId: 'instance-1',
			},
			payload: {
				frameType: 'open',
				payload: { prompt: 'hello' },
				parameter: {},
			},
		} as never)

		expect(events).toEqual(['before:hello', 'handler:hello', 'after:ok'])
	})

	it('derives local Harness addresses from authentic targets and rejects copied and unfinalized targets', async () => {
		const cleanBuilder = new StreamDefinitionBuilder('cleanSurface', 'No direct model capability')
		// @ts-expect-error Model providers belong to mounted Harness runtime configuration.
		void cleanBuilder.canUseHarnessModel
		expect((cleanBuilder as any).canUseHarnessModel).toBeUndefined()
		const localAgent = defineAgent('localAgent', {
			model: 'chat',
			instructions: 'Answer.',
		})
		const localWorkflow = defineWorkflow('localWorkflow', {
			async handler({ input }) {
				return input
			},
		})
		const localBuilder = new StreamDefinitionBuilder('localCaller', 'Call local Harness targets')
			.canInvokeAgent('LocalAi', '1', localAgent.contract)
			.canInvokeWorkflow('LocalAi', '1', localWorkflow.contract)
			.setStreamFunction(async function (context, _payload, _parameter, writer) {
				// @ts-expect-error Providers are configured on the mounted Harness, not exposed to handlers.
				void context.model
				expectTypeOf(context.agent.LocalAi['1'].localAgent.run).toBeFunction()
				expectTypeOf(context.agent.LocalAi['1'].localAgent.stream).toBeFunction()
				expectTypeOf(context.workflow.LocalAi['1'].localWorkflow.run).toBeFunction()
				expectTypeOf(context.workflow.LocalAi['1'].localWorkflow.stream).toBeFunction()
				await writer.close()
			})
		const definition = await localBuilder.getDefinition()
		// @ts-expect-error A workflow declaration rejects agent contracts.
		new StreamDefinitionBuilder('wrongKind', 'Reject wrong kind').canInvokeWorkflow('LocalAi', '1', localAgent.contract)

		expect(Object.keys(definition.invokes.LocalAi['1']).sort()).toEqual(['localAgent', 'localWorkflow'])
		expect(Object.keys(definition.streamInvokes.LocalAi['1']).sort()).toEqual(['localAgent', 'localWorkflow'])
		const invoke = vi.fn()
		const client = createHarnessInvocationProxy<any>('workflow', invoke, vi.fn(), undefined, definition.invokes)
		await expect(client.LocalAi['1'].localWorkflow.run('question')).rejects.toThrow('incomplete')
		expect(invoke).not.toHaveBeenCalled()
		expect(() =>
			new StreamDefinitionBuilder('copied', 'Reject copied target').canInvokeWorkflow('LocalAi', '1', {
				...localWorkflow.contract,
			} as never),
		).toThrow('authentic')
	})

	it('finalizes local agent and workflow declarations for a real stream service context', async () => {
		const valueSchema = z.object({ value: z.string() })
		const agent = defineAgent('classify', {
			model: 'chat',
			input: valueSchema,
			output: valueSchema,
			instructions: 'Return the classified value.',
			prompt: input => ({ role: 'user', content: input.value }),
		})
		const workflow = defineWorkflow('echo', {
			input: valueSchema,
			output: valueSchema,
			async handler({ input }) {
				return input
			},
		})
		const harness = defineHarness({ name: 'streamInvocation' }).addAgent(agent).addWorkflow(workflow)
		let observed: unknown
		const builder = new ServiceBuilder({
			serviceName: 'StreamInvocation',
			serviceVersion: '1',
			serviceDescription: 'finalized stream invocation test',
		})
		const stream = builder
			.getStreamBuilder('invokeHarness', 'invoke mounted Harness roots')
			.addPayloadSchema(valueSchema)
			.addFinalSchema(z.object({ completed: z.literal(true) }))
			.canInvokeAgent('StreamInvocation', '1', agent.contract)
			.canInvokeWorkflow('StreamInvocation', '1', workflow.contract)
			.setStreamFunction(async function (context, payload, _parameter, writer) {
				const agentResult = await context.agent.StreamInvocation['1'].classify.run(payload)
				const workflowStream = await context.workflow.StreamInvocation['1'].echo.stream(payload)
				for await (const _event of workflowStream) {
					// Consume the complete provider-neutral execution stream.
				}
				observed = { agentResult, workflowOutcome: await workflowStream.result }
				await writer.close({ completed: true })
			})
		builder.addStreamDefinition(stream.getDefinition()).mountHarness(harness)
		const eventBridge = new DefaultEventBridge()
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject(
			objectReply(
				{ value: 'classified' },
				{ usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 }, finishReason: 'stop' },
			),
		)
		await eventBridge.start()
		const service = await builder.getInstance(eventBridge, {
			ai: { models: { chat: { provider, model: 'fake' } } },
		} as never)
		await service.start()
		try {
			const command = getCommandMessageMock({
				receiver: { serviceName: 'StreamInvocation', serviceVersion: '1', serviceTarget: 'invokeHarness' },
				payload: { payload: { value: 'source' }, parameter: {} },
			})
			const {
				id: _id,
				messageType: _messageType,
				timestamp: _timestamp,
				correlationId: _correlationId,
				...request
			} = command
			const handle = await eventBridge.openStream({
				...request,
				payload: { frameType: 'open', payload: { value: 'source' }, parameter: {} },
			} as never)
			const frames: unknown[] = []
			for await (const frame of handle) frames.push(frame.payload)

			expect(frames).toContainEqual(expect.objectContaining({ frameType: 'complete', final: { completed: true } }))
			expect(observed).toMatchObject({
				agentResult: { outcome: { status: 'completed', output: { value: 'classified' } } },
				workflowOutcome: { status: 'completed', output: { value: 'source' } },
			})
			provider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})

	it('runs and streams generated remote agents and workflows through a real stream context', async () => {
		const remoteAgent = createRemoteTarget('agent', 'remoteAgent')
		const remoteWorkflow = createRemoteTarget('workflow', 'remoteWorkflow')
		// @ts-expect-error An agent declaration rejects generated workflow contracts.
		new StreamDefinitionBuilder('wrongRemoteKind', 'Reject wrong remote kind').canInvokeAgent(remoteWorkflow)
		const observedSessions: string[] = []
		const remoteBuilder = new StreamDefinitionBuilder('remoteCaller', 'Call generated remote Harness targets')
			.canInvokeAgent(remoteAgent)
			.canInvokeWorkflow(remoteWorkflow)
			.setStreamFunction(async function (context, _payload, _parameter, writer) {
				const agentRun = await context.agent.RemoteAi['2'].remoteAgent.run('agent-run', {
					sessionId: 'agent-run-session',
				})
				const agentStream = await context.agent.RemoteAi['2'].remoteAgent.stream('agent-stream', {
					sessionId: 'agent-stream-session',
				})
				const workflowRun = await context.workflow.RemoteAi['2'].remoteWorkflow.run('workflow-run', {
					sessionId: 'workflow-run-session',
				})
				const workflowStream = await context.workflow.RemoteAi['2'].remoteWorkflow.stream('workflow-stream', {
					sessionId: 'workflow-stream-session',
				})
				expectTypeOf(agentRun.outcome).not.toBeAny()
				expectTypeOf(workflowRun.outcome).not.toBeAny()
				observedSessions.push(
					agentRun.sessionId,
					agentStream.sessionId,
					workflowRun.sessionId,
					workflowStream.sessionId,
				)
				await writer.close()
			})
		const definition = await remoteBuilder.getDefinition()
		const eventBridge = getEventBridgeMock(sandbox)
		eventBridge.stubs.invoke.callsFake(async message => ({
			sessionId: message.harness.root.sessionId,
			outcome: { status: 'completed', runId: message.harness.root.invocationId, output: 'done' },
		}))
		eventBridge.stubs.openStream.callsFake(async message =>
			remoteHarnessStream(message.harness.root.invocationId, 'done'),
		)
		const runtime = new Service({
			info: {
				serviceName: 'Caller',
				serviceVersion: '1',
				serviceDescription: 'Stream builder Harness test',
			},
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			streamDefinitionList: [definition],
			logger: getLoggerMock(sandbox).mock,
			eventBridge: eventBridge.mock,
			config: {},
		})
		await runtime.registerStream(definition)
		await runtime.executeStream({
			id: 'remote-stream-open',
			correlationId: 'remote-stream-correlation',
			timestamp: Date.now(),
			traceId: 'remote-stream-trace',
			messageType: EBMessageType.Stream,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			sender: {
				serviceName: 'Client',
				serviceVersion: '1',
				serviceTarget: 'open',
				instanceId: 'client-1',
			},
			receiver: { serviceName: 'Caller', serviceVersion: '1', serviceTarget: 'remoteCaller' },
			payload: { frameType: 'open', payload: {}, parameter: {} },
		} as never)

		expect(observedSessions).toEqual([
			'agent-run-session',
			'agent-stream-session',
			'workflow-run-session',
			'workflow-stream-session',
		])
		expect(eventBridge.stubs.invoke.callCount).toBe(2)
		expect(eventBridge.stubs.openStream.callCount).toBe(2)
	})
})

function remoteHarnessStream(runId: string, output: string) {
	const outcome = { status: 'completed' as const, runId, output }
	return {
		sessionId: 'transport-session',
		cancel: vi.fn(async () => undefined),
		async *[Symbol.asyncIterator]() {
			yield {
				payload: {
					frameType: 'chunk' as const,
					sequence: 1,
					chunk: {
						type: 'run.started' as const,
						eventId: 'start',
						sequence: 1,
						runId,
						at: '2026-09-08T00:00:00.000Z',
					},
				},
			}
			yield {
				payload: {
					frameType: 'chunk' as const,
					sequence: 2,
					chunk: {
						type: 'run.finished' as const,
						eventId: 'finished',
						sequence: 2,
						runId,
						at: '2026-09-08T00:00:01.000Z',
						outcome,
					},
				},
			}
			yield { payload: { frameType: 'complete' as const, sequence: 3, final: outcome } }
		},
	}
}
