import {
	defineAgent,
	defineHarness,
	defineWorkflow,
	InMemoryHarnessStorage,
	type JsonValue,
	type ModelSchema,
} from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { getNewCorrelationId } from '../core/helper/getNewCorrelationId.impl.js'
import { DefaultEventBridge } from '../DefaultEventBridge/DefaultEventBridge.impl.js'
import { getCommandMessageMock } from '../mocks/messages/getCommandMessage.mock.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { createMountedHarnessTargetProjections } from './projection.js'
import './harnessMount.authorization.test.js'
import './harnessMount.lifecycle.test.js'
import './harnessMount.mount-types.test.js'
import './harnessMount.receiver.test.js'
import './harnessMount.test.fixture.js'

const objectSchema = generatedSchema<{ value: string }, { value: string }>({
	type: 'object',
	additionalProperties: false,
	required: ['value'],
	properties: { value: { type: 'string' } },
})
const transformedObjectSchema = generatedSchema<{ value: string }, { value: string }>(
	{ type: 'object', additionalProperties: false, required: ['value'], properties: { value: { type: 'string' } } },
	undefined,
	value => {
		transforms += 1
		return { value: value.value.trim() }
	},
)

const privateLookup = defineAgent('privateLookup', {
	model: 'chat',
	instructions: 'Look up the supplied value.',
	input: objectSchema,
	output: objectSchema,
	prompt: input => ({ role: 'user', content: input.value }),
})

let transforms = 0
const publicEcho = defineWorkflow('echo', {
	input: transformedObjectSchema,
	output: objectSchema,
	agents: [privateLookup],
	async handler(context) {
		return context.input
	},
})

const mountedHarness = defineHarness({ name: 'mountedRuntime', revision: 'mounted-runtime-r1' }).addWorkflow(publicEcho)

const serviceAddress = Object.freeze({ serviceName: 'Harness', serviceVersion: '1', serviceTarget: 'echo' })
const dependencyAddress = Object.freeze({ serviceName: 'Harness', serviceVersion: '1', serviceTarget: 'privateLookup' })
type MountPolicy = any

function mountOptions(policy?: MountPolicy) {
	return new ServiceBuilder({
		serviceName: 'Harness',
		serviceVersion: '1',
		serviceDescription: 'P4-004 mounted receiver test service',
	}).mountHarness(mountedHarness as never, policy as never)
}

function projections(policy?: MountPolicy): any[] {
	return (createMountedHarnessTargetProjections as any)(mountedHarness, {
		serviceName: 'Harness',
		serviceVersion: '1',
		...(policy === undefined ? {} : { policy: policy as never }),
	})
}

function rootEnvelope(policy?: MountPolicy, sessionId = 'session-1') {
	const root = projections(policy).find(projection => projection.target.id === 'echo')
	if (!root) throw new Error('Expected the echo root projection.')
	return {
		contract: { schemaVersion: 1 as const, exportDigest: root.exportDigest },
		root: { invocationId: getNewCorrelationId(), sessionId },
	}
}

function rootCommand(input: { value: string }, policy?: MountPolicy) {
	const message = getCommandMessageMock({
		tenantId: 'tenant-a',
		principalId: 'reviewer-a',
		receiver: serviceAddress,
		payload: { payload: input, parameter: {} },
		harness: rootEnvelope(policy),
	})
	const { id: _id, messageType: _type, timestamp: _timestamp, correlationId: _correlationId, ...request } = message
	return request
}

async function startMounted(policy?: MountPolicy) {
	const eventBridge = new DefaultEventBridge()
	await eventBridge.start()
	const builder = mountOptions(policy)
	const service = await builder.getInstance(eventBridge, {
		ai: { models: { chat: { provider: new FakeModelProvider(), model: 'fake' } } },
	} as never)
	await service.start()
	return { eventBridge, service }
}

async function destroyMounted(value: { eventBridge: DefaultEventBridge; service: { destroy(): Promise<void> } }) {
	await value.service.destroy()
	await value.eventBridge.destroy()
}

function generatedSchema<Input extends JsonValue, Output extends JsonValue>(
	inputJsonSchema: Readonly<Record<string, unknown>>,
	outputJsonSchema: Readonly<Record<string, unknown>> | undefined = inputJsonSchema,
	transform: (value: Input) => Output = value => value as unknown as Output,
): ModelSchema<Input, Output> {
	const schema = { marker: 'p4-004-fixture' }
	Object.defineProperty(schema, '~standard', {
		enumerable: false,
		value: Object.freeze({
			version: 1,
			vendor: 'p4-004-fixture',
			validate(value: unknown) {
				return { value: transform(value as Input) }
			},
			types: undefined as unknown as { input: Input; output: Output },
			jsonSchema: Object.freeze({ input: () => inputJsonSchema, output: () => outputJsonSchema ?? inputJsonSchema }),
		}),
	})
	return schema as unknown as ModelSchema<Input, Output>
}

function persistentStorage() {
	const storage = new InMemoryHarnessStorage()
	const capabilities = Object.freeze([...storage.capabilities, 'storage.persistent'] as const)
	Object.defineProperty(storage, 'capabilities', { value: capabilities })
	Object.defineProperty(storage, 'info', { value: Object.freeze({ ...storage.info, capabilities }) })
	return storage
}

describe('P4-004 mounted Harness receivers', () => {
	it('uses v4 standalone target definitions and projects one aggregate plus one stream root while keeping dependencies nested-only', () => {
		const rows = projections()
		const root = rows.find(row => row.target.id === 'echo')
		const dependency = rows.find(row => row.target.id === 'privateLookup')

		expect(root).toMatchObject({ visibility: 'root', address: serviceAddress })
		expect(root?.targetExport.invocation).toEqual({ aggregate: true, stream: true, resumableInterrupts: [] })
		expect(dependency).toMatchObject({ visibility: 'dependency', address: dependencyAddress })
		expect(dependency?.completedEvent).toBeUndefined()
		expect(dependency?.policy).toBeNull()
	})

	it('finalizes a local workflow declaration and routes command run and stream calls through EventBridge', async () => {
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const builder = new ServiceBuilder({
			serviceName: 'Harness',
			serviceVersion: '1',
			serviceDescription: 'local Harness invocation service',
		})
		const invokeEcho = builder
			.getCommandBuilder('invokeEcho', 'Invoke the mounted workflow')
			.addPayloadSchema(objectSchema)
			.canInvokeWorkflow('Harness', '1', publicEcho.contract)
			.setCommandFunction(async function ({ workflow }, payload) {
				const aggregate = await workflow.Harness['1'].echo.run(payload, { sessionId: 'aggregate-session' })
				const stream = await workflow.Harness['1'].echo.stream(payload, { sessionId: 'stream-session' })
				for await (const _event of stream) {
					// The terminal is consumed through the canonical result promise below.
				}
				return { aggregate, streamed: { sessionId: stream.sessionId, outcome: await stream.result } }
			})
		builder.addCommandDefinition(invokeEcho.getDefinition()).mountHarness(mountedHarness)
		const service = await builder.getInstance(eventBridge, {
			ai: { models: { chat: { provider: new FakeModelProvider(), model: 'fake' } } },
		} as never)
		await service.start()
		try {
			const request = getCommandMessageMock({
				receiver: { serviceName: 'Harness', serviceVersion: '1', serviceTarget: 'invokeEcho' },
				payload: { payload: { value: ' local ' }, parameter: {} },
			})
			const { id: _id, messageType: _type, timestamp: _timestamp, correlationId: _correlationId, ...message } = request
			await expect(eventBridge.invoke(message)).resolves.toEqual({
				aggregate: {
					sessionId: 'aggregate-session',
					outcome: { status: 'completed', runId: expect.any(String), output: { value: 'local' } },
				},
				streamed: {
					sessionId: 'stream-session',
					outcome: { status: 'completed', runId: expect.any(String), output: { value: 'local' } },
				},
			})
		} finally {
			await service.destroy()
			await eventBridge.destroy()
			transforms = 0
		}
	})

	it('rejects an unprojected local Harness declaration before EventBridge registration', async () => {
		const missing = defineAgent('missing', {
			model: 'chat',
			instructions: 'Never runs.',
		})
		const builder = new ServiceBuilder({
			serviceName: 'Harness',
			serviceVersion: '1',
			serviceDescription: 'invalid local Harness invocation service',
		})
		const command = builder
			.getCommandBuilder('invokeMissing', 'Invoke an unmounted target')
			.canInvokeAgent('Harness', '1', missing.contract)
			.setCommandFunction(async function ({ agent }) {
				return agent.Harness['1'].missing.run('input')
			})
		builder.addCommandDefinition(command.getDefinition()).mountHarness(mountedHarness)
		const eventBridge = new DefaultEventBridge()
		const registerCommand = vi.spyOn(eventBridge, 'registerCommand')
		await expect(
			builder.getInstance(eventBridge, {
				ai: { models: { chat: { provider: new FakeModelProvider(), model: 'fake' } } },
			} as never),
		).rejects.toThrow('has no matching mounted target projection')
		expect(registerCommand).not.toHaveBeenCalled()
	})

	it('rejects a dependency-only local agent declaration before EventBridge dispatch', async () => {
		const builder = new ServiceBuilder({
			serviceName: 'Harness',
			serviceVersion: '1',
			serviceDescription: 'dependency-only local Harness invocation service',
		})
		const command = builder
			.getCommandBuilder('invokePrivateLookup', 'Attempt to invoke a dependency-only agent as a root')
			.canInvokeAgent('Harness', '1', privateLookup.contract)
			.setCommandFunction(async function ({ agent }) {
				return agent.Harness['1'].privateLookup.run({ value: 'must not dispatch' })
			})
		builder.addCommandDefinition(command.getDefinition()).mountHarness(mountedHarness)
		const eventBridge = new DefaultEventBridge()
		const invoke = vi.spyOn(eventBridge, 'invoke')
		const registerCommand = vi.spyOn(eventBridge, 'registerCommand')

		await expect(
			builder.getInstance(eventBridge, {
				ai: { models: { chat: { provider: new FakeModelProvider(), model: 'fake' } } },
			} as never),
		).rejects.toThrow('has no matching mounted target projection')
		expect(registerCommand).not.toHaveBeenCalled()
		expect(invoke).not.toHaveBeenCalled()
	})

	it('rejects a host-tool nested target declared at the wrong address before EventBridge dispatch', async () => {
		const builder = new ServiceBuilder({
			serviceName: 'Harness',
			serviceVersion: '1',
			serviceDescription: 'wrong host-tool nested target address',
		})
		const nestedWorkflow = defineWorkflow('nestedEcho', {
			input: objectSchema,
			output: objectSchema,
			async handler({ input }) {
				return input
			},
		})
		const hostTool = builder
			.defineTool('invokeNested', {
				description: 'Invoke the nested workflow.',
				input: objectSchema,
				output: objectSchema,
			})
			.canInvokeWorkflow('WrongService', '9', nestedWorkflow.contract)
			.setHandler(async (context, input) =>
				context.workflow.WrongService['9'].nestedEcho.run(input, { callId: 'nested-call' }),
			)
		const caller = defineAgent('hostToolCaller', {
			model: 'chat',
			input: objectSchema,
			instructions: 'Use the nested workflow tool.',
			tools: [hostTool],
			prompt: input => ({ role: 'user', content: input.value }),
		})
		const definition = defineHarness({ name: 'wrongHostToolAddress', revision: '1' })
			.addAgent(caller)
			.addWorkflow(nestedWorkflow)
		builder.mountHarness(definition)
		const eventBridge = new DefaultEventBridge()
		const invoke = vi.spyOn(eventBridge, 'invoke')
		const registerCommand = vi.spyOn(eventBridge, 'registerCommand')

		await expect(
			builder.getInstance(eventBridge, {
				ai: { models: { chat: { provider: new FakeModelProvider(), model: 'fake' } } },
			} as never),
		).rejects.toThrow('has no matching mounted projection')
		expect(registerCommand).not.toHaveBeenCalled()
		expect(invoke).not.toHaveBeenCalled()
	})

	it('runs a host-tool nested target through its exact mounted EventBridge route', async () => {
		const builder = new ServiceBuilder({
			serviceName: 'Harness',
			serviceVersion: '1',
			serviceDescription: 'host-tool nested EventBridge invocation',
		})
		const nestedAgent = defineAgent('nestedEcho', {
			model: 'chat',
			input: objectSchema,
			instructions: 'Return a short nested response.',
			prompt: input => ({ role: 'user', content: input.value }),
		})
		let hostToolCalls = 0
		const hostTool = builder
			.defineTool('invokeNested', {
				description: 'Invoke the nested agent.',
				input: objectSchema,
				output: generatedSchema<string, string>({ type: 'string' }),
			})
			.canInvokeAgent('Harness', '1', nestedAgent.contract)
			.setHandler(async (context, input) => {
				hostToolCalls += 1
				return context.agent.Harness['1'].nestedEcho.run(input, { callId: 'nested-call' })
			})
		const caller = defineAgent('hostToolCaller', {
			model: 'chat',
			input: objectSchema,
			instructions: 'Use invokeNested once, then return a short answer.',
			tools: [hostTool],
			subagents: { nestedEcho: nestedAgent },
			prompt: input => ({ role: 'user', content: input.value }),
		})
		const definition = defineHarness({
			name: 'hostToolNestedEventBridge',
			revision: '1',
			defaults: { maxDepth: 1 },
		}).addAgent(caller)
		builder.mountHarness(definition)
		const provider = new FakeModelProvider({ strict: true })
		const usage = { inputTokens: 1, outputTokens: 1, totalTokens: 2 }
		provider.enqueueText({
			content: '',
			toolCalls: [{ id: 'invoke-nested-call', name: hostTool.id, arguments: { value: 'from tool' } }],
			usage,
			finishReason: 'tool_calls',
		})
		provider.enqueueText({ content: 'nested response', toolCalls: [], usage, finishReason: 'stop' })
		provider.enqueueText({ content: 'nested complete', toolCalls: [], usage, finishReason: 'stop' })
		const eventBridge = new DefaultEventBridge()
		const openStream = vi.spyOn(eventBridge, 'openStream')
		await eventBridge.start()
		const service = await builder.getInstance(eventBridge, {
			ai: { models: { chat: { provider, model: 'fake' } }, storage: persistentStorage() },
		} as never)
		await service.start()
		try {
			const projection = createMountedHarnessTargetProjections(definition, {
				serviceName: 'Harness',
				serviceVersion: '1',
			}).find(entry => entry.target === caller.contract)
			if (!projection) throw new Error('Expected the host-tool caller root projection.')
			const request = getCommandMessageMock({
				receiver: projection.address,
				payload: { payload: { value: 'start' }, parameter: {} },
				harness: {
					contract: { schemaVersion: 1, exportDigest: projection.exportDigest },
					root: { invocationId: getNewCorrelationId(), sessionId: 'host-tool-session' },
				},
			})
			const { id: _id, messageType: _type, timestamp: _timestamp, correlationId: _correlationId, ...message } = request
			await expect(eventBridge.invoke(message)).resolves.toMatchObject({
				sessionId: 'host-tool-session',
				outcome: { status: 'completed', output: 'nested complete' },
			})
			expect(hostToolCalls).toBe(1)
			expect(openStream).toHaveBeenCalled()
			provider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})

	it('rejects malformed policy, a mixed root/dispatch envelope, and an export-digest mismatch before target execution', async () => {
		expect(() => projections({ targets: { workflows: { missing: {} } } } as never)).toThrow()
		const mounted = await startMounted()
		try {
			const mixed = {
				...rootCommand({ value: ' no execution ' }),
				harness: {
					...rootEnvelope(),
					dispatch: {
						sessionId: 'child-session',
						rootRunId: 'root-run',
						parentRunId: 'parent-run',
						invocationId: 'child-invocation',
						parentWorkflowId: 'echo',
						depth: 1,
						remainingDepth: 0,
					},
				},
			}
			await expect(mounted.eventBridge.invoke(mixed as never)).rejects.toMatchObject({ errorCode: 400 })
			const mismatch = rootCommand({ value: ' no execution ' })
			await expect(
				mounted.eventBridge.invoke({
					...mismatch,
					harness: { ...rootEnvelope(), contract: { schemaVersion: 1, exportDigest: `sha256:${'0'.repeat(64)}` } },
				} as never),
			).rejects.toMatchObject({ errorCode: 409 })
			expect(transforms).toBe(0)
		} finally {
			await destroyMounted(mounted)
		}
	})

	it('transforms a fresh root input once, preserves the current reviewer through guards, and returns the closed aggregate envelope', async () => {
		transforms = 0
		const order: string[] = []
		const policy = {
			targets: {
				workflows: {
					echo: {
						beforeGuards: {
							authorize: (context: any, input: { value: string }) =>
								order.push(`before:${context.identity.principalId}:${input.value}`),
						},
						afterGuards: { audit: (_context: any, outcome: any) => order.push(`after:${outcome.status}`) },
					},
				},
			},
		} as const
		const mounted = await startMounted(policy)
		try {
			await expect(
				mounted.eventBridge.invoke(rootCommand({ value: '  validated  ' }, policy) as never),
			).resolves.toEqual({
				sessionId: 'session-1',
				outcome: { status: 'completed', runId: expect.any(String), output: { value: 'validated' } },
			})
			expect(transforms).toBe(1)
			expect(order).toEqual(['before:reviewer-a:validated', 'after:completed'])
		} finally {
			await destroyMounted(mounted)
		}
	})

	it('uses dispatchStream.result as the terminal authority and gives aggregate and stream the same terminal outcome', async () => {
		const mounted = await startMounted()
		try {
			const aggregate = await mounted.eventBridge.invoke(rootCommand({ value: 'stream parity' }) as never)
			const command = rootCommand({ value: 'stream parity' })
			const stream = await mounted.eventBridge.openStream({
				...command,
				payload: { frameType: 'open', payload: { value: 'stream parity' }, parameter: {} },
				harness: rootEnvelope(),
			} as never)
			const frames: unknown[] = []
			for await (const frame of stream) frames.push(frame.payload)
			const complete = frames.find((frame: any) => frame.frameType === 'complete') as any
			const aggregateOutcome = (aggregate as { outcome: { status: string; output: unknown } }).outcome
			expect(complete.final).toMatchObject({
				status: aggregateOutcome.status,
				output: aggregateOutcome.output,
			})
			expect(complete.final.runId).toEqual(expect.any(String))
		} finally {
			await destroyMounted(mounted)
		}
	})

	it('publishes a completed root event once after after-guards', async () => {
		const received: unknown[] = []
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const policy = {
			targets: {
				workflows: {
					echo: {
						afterGuards: { audit: () => received.push('after') },
						successEvent: 'harness.echo.completed',
					},
				},
			},
		} as const
		await eventBridge.registerSubscription(
			{
				sender: serviceAddress,
				eventName: 'harness.echo.completed',
				subscriber: { serviceName: 'Audit', serviceVersion: '1', serviceTarget: 'record' },
				eventBridgeConfig: { durable: false, autoacknowledge: true, shared: true },
			},
			async message => {
				received.push(message.payload)
			},
		)
		const builder = mountOptions(policy)
		const service = await builder.getInstance(eventBridge, {
			ai: { models: { chat: { provider: new FakeModelProvider(), model: 'fake' } } },
		} as never)
		await service.start()
		try {
			await eventBridge.invoke(rootCommand({ value: 'event' }, policy) as never)
			await new Promise(resolve => process.nextTick(resolve))
			expect(received).toEqual(['after', expect.objectContaining({ status: 'completed', output: { value: 'event' } })])
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})

	it('cleans registered root and dependency receivers on shutdown', async () => {
		const mounted = await startMounted()
		try {
			const unregisterCommand = vi.spyOn(mounted.eventBridge, 'unregisterCommand')
			const unregisterStream = vi.spyOn(mounted.eventBridge, 'unregisterStream')
			await mounted.service.destroy()
			expect(unregisterCommand).toHaveBeenCalledTimes(1)
			expect(unregisterCommand).toHaveBeenCalledWith(serviceAddress)
			expect(unregisterStream).toHaveBeenCalledTimes(2)
			expect(unregisterStream).toHaveBeenCalledWith(serviceAddress)
			expect(unregisterStream).toHaveBeenCalledWith(dependencyAddress)
		} finally {
			await new Promise(resolve => setImmediate(resolve))
			await mounted.eventBridge.destroy()
		}
	})
})
