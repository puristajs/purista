import {
	defineAgent,
	defineHarness,
	defineWorkflow,
	type ExecutionEvent,
	type ExecutionTerminalOutcome,
	type HarnessInterrupt,
	type HarnessTargetRunOutcome,
	type JsonValue,
} from '@purista/harness'
import { createHostOwnerToken } from '@purista/harness/integrator'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'

import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import type { Command } from '../core/types/commandType/Command.js'
import { EBMessageType } from '../core/types/EBMessageType.enum.js'
import type { StreamFrame } from '../core/types/stream/StreamFrame.js'
import type { StreamOpenRequest } from '../core/types/stream/StreamOpenRequest.js'
import { DefaultEventBridge } from '../DefaultEventBridge/DefaultEventBridge.impl.js'
import { getLoggerMock } from '../mocks/getLogger.mock.js'
import { getCommandMessageMock } from '../mocks/messages/getCommandMessage.mock.js'
import {
	type AnyMountPolicy,
	dependencyTargetName,
	generatedModelSchema,
	mountedBuilder,
	mountedHarness,
	projectionsFor,
	rootAddress,
	rootCommandRequest,
	rootEnvelope,
	rootTargetName,
	type rootWorkflow,
	startMounted,
	stopMounted,
} from './harnessMount.test.fixture.js'
import { HarnessMountRuntime } from './runtime.js'
import type { HarnessMount, PuristaToolContext } from './types.js'

type CommandReceiver = Parameters<DefaultEventBridge['registerCommand']>[1]
type StreamReceiver = Parameters<DefaultEventBridge['registerStream']>[1]
type EventMessage = Parameters<EventBridge['emitMessage']>[0]

class InspectableEventBridge extends DefaultEventBridge {
	readonly commandRegistrations: string[] = []
	readonly streamRegistrations: string[] = []
	readonly emittedEvents: string[] = []
	readonly emittedFrames: StreamFrame['payload'][] = []
	readonly commandReceivers = new Map<string, CommandReceiver>()
	readonly streamReceivers = new Map<string, StreamReceiver>()

	override async registerCommand(...args: Parameters<DefaultEventBridge['registerCommand']>): Promise<string> {
		const [address, receiver, metadata] = args
		this.commandRegistrations.push(address.serviceTarget)
		this.commandReceivers.set(address.serviceTarget, receiver)
		return super.registerCommand(address, receiver, metadata)
	}

	override async registerStream(...args: Parameters<DefaultEventBridge['registerStream']>): Promise<string> {
		const [address, receiver, metadata] = args
		this.streamRegistrations.push(address.serviceTarget)
		this.streamReceivers.set(address.serviceTarget, receiver)
		return super.registerStream(address, receiver, metadata)
	}

	override async emitMessage(message: EventMessage) {
		if (message.messageType === EBMessageType.CustomMessage && message.eventName) {
			this.emittedEvents.push(message.eventName)
		}
		if (
			message.messageType === EBMessageType.Stream &&
			typeof message.payload === 'object' &&
			message.payload !== null &&
			'frameType' in message.payload &&
			message.payload.frameType !== 'open'
		) {
			this.emittedFrames.push(unsafeTransport(message.payload))
		}
		return super.emitMessage(message)
	}

	override async destroy(): Promise<void> {
		// Registration emits are delivered through the bridge's internal streams.
		// Let their queued callbacks drain before ending those streams.
		await new Promise<void>(resolve => setImmediate(resolve))
		await super.destroy()
	}
}

const dispatchEnvelope = (overrides: Readonly<Record<string, unknown>> = {}) =>
	Object.freeze({
		contract: rootEnvelope().contract,
		dispatch: Object.freeze({
			sessionId: 'nested-session',
			rootRunId: 'root-run',
			parentRunId: 'parent-run',
			invocationId: 'nested-invocation',
			parentWorkflowId: rootTargetName,
			depth: 1,
			remainingDepth: 1,
			...overrides,
		}),
	})

function streamRequest(
	payload: JsonValue,
	target: string,
	harness: unknown,
	parameter: Readonly<Record<string, unknown>> = {},
): Omit<StreamOpenRequest, 'id' | 'messageType' | 'timestamp' | 'correlationId'> {
	const request = rootCommandRequest(payload, { targetName: rootTargetName })
	return unsafeTransport({
		...request,
		receiver: { ...rootAddress, serviceTarget: target },
		payload: { frameType: 'open', payload, parameter },
		harness,
	})
}

async function collect(handle: AsyncIterable<Readonly<StreamFrame>>): Promise<readonly StreamFrame['payload'][]> {
	const frames: StreamFrame['payload'][] = []
	for await (const frame of handle) frames.push(frame.payload)
	return frames
}

function commandErrorStatus(response: Awaited<ReturnType<CommandReceiver>>): number | undefined {
	return response.messageType === EBMessageType.CommandErrorResponse ? response.payload.status : undefined
}

/** The sole erased-JavaScript boundary used to inject malformed transport values. */
function unsafeTransport<T>(value: unknown): T {
	return value as T
}

function instrumentedDefinition() {
	const effects = { transforms: 0, guards: 0, handlers: 0 }
	const schema = generatedModelSchema<{ value: string }, { value: string }>(
		{
			type: 'object',
			additionalProperties: false,
			required: ['value'],
			properties: { value: { type: 'string' } },
		},
		undefined,
		input => {
			effects.transforms += 1
			if (typeof input.value !== 'string') throw new TypeError('value must be a string')
			return { value: input.value.trim() }
		},
	)
	const workflow = defineWorkflow('guardedRoot', {
		input: schema,
		output: schema,
		async handler(context) {
			effects.handlers += 1
			return context.input
		},
	})
	const definition = defineHarness({ name: 'receiverEffects', revision: 'receiver-effects-r1' }).addWorkflow(workflow)
	const policy = {
		targets: {
			workflows: {
				guardedRoot: {
					beforeGuards: {
						count: () => {
							effects.guards += 1
						},
					},
				},
			},
		},
	} satisfies AnyMountPolicy
	return { definition, workflow, policy, effects }
}

type Terminal = ExecutionTerminalOutcome<JsonValue, HarnessInterrupt>
type Event = ExecutionEvent<JsonValue>
type HostedStream = AsyncIterable<Event> & {
	result: Promise<Terminal>
	cancel(reason?: string): Promise<void>
}
type HostedFacade = {
	streamHosted(request: unknown): Promise<HostedStream>
}

const protocolRunId = 'protocol-run'
const protocolOutcome = Object.freeze({
	status: 'completed' as const,
	runId: protocolRunId,
	output: Object.freeze({ value: 'protocol output' }),
})
const directStart = Object.freeze({
	type: 'run.started' as const,
	runId: protocolRunId,
	eventId: 'protocol-start',
	sequence: 0,
	at: '2026-09-09T00:00:00.000Z',
})
const directTerminal = Object.freeze({
	type: 'run.finished' as const,
	runId: protocolRunId,
	eventId: 'protocol-terminal',
	sequence: 1,
	at: '2026-09-09T00:00:01.000Z',
	outcome: protocolOutcome,
})

function scriptedHostedStream(events: readonly Event[], result: Terminal = protocolOutcome): HostedStream {
	return {
		result: Promise.resolve(result),
		cancel: vi.fn(async () => undefined),
		async *[Symbol.asyncIterator]() {
			for (const event of events) yield event
		},
	}
}

async function startProtocolFixture() {
	const eventBridge = new InspectableEventBridge()
	await eventBridge.start()
	const policy = { targets: { workflows: { echo: { successEvent: 'protocol.completed' } } } }
	const definition = mountedHarness as HarnessMount['definition']
	const mountedPolicy = policy as HarnessMount['policy']
	const runtime = new HarnessMountRuntime({
		serviceName: rootAddress.serviceName,
		serviceVersion: rootAddress.serviceVersion,
		eventBridge,
		logger: getLoggerMock().mock,
		mount: { definition, policy: mountedPolicy, projections: projectionsFor(definition, mountedPolicy) },
		config: unsafeTransport<ConstructorParameters<typeof HarnessMountRuntime>[0]['config']>({
			model: { provider: new FakeModelProvider(), model: 'fake' },
		}),
		resources: {},
		hostOwner: createHostOwnerToken<PuristaToolContext>(),
		createHostContext: () => {
			throw new Error('The protocol fixture has no host tools.')
		},
	})
	await runtime.start()
	const hosted = Reflect.get(runtime, 'runtime') as HostedFacade
	return {
		runtime,
		eventBridge,
		replaceStream(stream: HostedStream) {
			const streamHosted = vi.fn(async (_request: unknown) => stream)
			Reflect.set(runtime, 'runtime', {
				...hosted,
				streamHosted,
			})
			return streamHosted
		},
		streamReceiver() {
			const receiver = eventBridge.streamReceivers.get(rootTargetName)
			if (!receiver) throw new Error('Expected the protocol stream receiver.')
			return receiver
		},
		openMessage(): StreamOpenRequest {
			return unsafeTransport({
				...getCommandMessageMock({
					receiver: rootAddress,
					payload: { payload: { value: 'protocol input' }, parameter: {} },
					harness: rootEnvelope(definition, mountedPolicy, 'protocol-session'),
				}),
				messageType: EBMessageType.Stream,
				payload: { frameType: 'open', payload: { value: 'protocol input' }, parameter: {} },
			})
		},
		async stop() {
			try {
				await runtime.shutdown()
			} finally {
				await eventBridge.destroy()
			}
		},
	}
}

function assertProtocolFailure(frames: readonly StreamFrame['payload'][], phase: 'pre-start' | 'post-start'): void {
	const terminalFrames = frames.filter(
		frame =>
			frame.frameType === 'chunk' &&
			typeof frame.chunk === 'object' &&
			frame.chunk !== null &&
			'type' in frame.chunk &&
			frame.chunk.type === 'run.finished',
	)
	if (phase === 'pre-start') {
		expect(frames).toEqual([
			expect.objectContaining({ frameType: 'error', error: expect.objectContaining({ status: 500 }) }),
		])
		return
	}
	expect(terminalFrames).toHaveLength(1)
	expect(terminalFrames[0]).toMatchObject({
		chunk: {
			type: 'run.finished',
			outcome: {
				status: 'failed',
				runId: protocolRunId,
				error: { code: 'PURISTA_HANDLED_ERROR', category: 'internal', retriable: false },
			},
		},
	})
	expect(frames.filter(frame => frame.frameType === 'complete')).toEqual([
		expect.objectContaining({
			final: expect.objectContaining({ status: 'failed', runId: protocolRunId }),
		}),
	])
}

describe('P4-004 mounted Harness receiver matrix', () => {
	it('registers exactly one aggregate root and one stream per root/dependency target', async () => {
		const eventBridge = new InspectableEventBridge()
		const mounted = await startMounted({ eventBridge })
		try {
			expect(eventBridge.commandRegistrations).toEqual([rootTargetName])
			expect([...eventBridge.streamRegistrations].sort()).toEqual([dependencyTargetName, rootTargetName].sort())
			expect(eventBridge.commandReceivers.has(dependencyTargetName)).toBe(false)
			expect(eventBridge.streamReceivers.has(dependencyTargetName)).toBe(true)
		} finally {
			await stopMounted(mounted)
		}
	})

	it('returns closed aggregate and stream results with the same canonical terminal outcome', async () => {
		const mounted = await startMounted()
		try {
			const aggregate = await mounted.eventBridge.invoke<{
				sessionId: string
				outcome: HarnessTargetRunOutcome<typeof rootWorkflow.contract>
			}>(rootCommandRequest({ value: 'parity' }))
			const frames = await collect(
				await mounted.eventBridge.openStream(streamRequest({ value: 'parity' }, rootTargetName, rootEnvelope())),
			)
			const complete = frames.find(frame => frame.frameType === 'complete')
			const terminal = frames.find(
				frame =>
					frame.frameType === 'chunk' &&
					typeof frame.chunk === 'object' &&
					frame.chunk !== null &&
					'type' in frame.chunk &&
					frame.chunk.type === 'run.finished',
			)

			expect(Object.keys(aggregate).sort()).toEqual(['outcome', 'sessionId'])
			expect(aggregate.sessionId).toBe('session-1')
			expect(complete?.final).toMatchObject({ status: 'completed', output: { value: 'parity' } })
			expect(terminal?.chunk).toMatchObject({ outcome: complete?.final })
			if (aggregate.outcome.status !== 'completed') throw new Error('Expected a completed aggregate outcome.')
			expect(complete?.final).toMatchObject({ status: aggregate.outcome.status, output: aggregate.outcome.output })
			expect(Object.keys(complete?.final ?? {}).sort()).toEqual(['output', 'runId', 'status'])
		} finally {
			await stopMounted(mounted)
		}
	})

	it('bypasses every root policy branch for a nested dispatch to a root stream', async () => {
		const before = vi.fn()
		const after = vi.fn()
		const policy = {
			targets: {
				workflows: {
					echo: {
						beforeGuards: { authorize: before },
						afterGuards: { audit: after },
						successEvent: 'echo.completed',
					},
				},
			},
		} satisfies AnyMountPolicy
		const eventBridge = new InspectableEventBridge()
		const mounted = await startMounted({ eventBridge, policy })
		try {
			const frames = await collect(
				await eventBridge.openStream(streamRequest({ value: 'nested root' }, rootTargetName, dispatchEnvelope())),
			)
			expect(frames.at(-1)).toMatchObject({
				frameType: 'complete',
				final: { status: 'completed', runId: 'nested-invocation', output: { value: 'nested root' } },
			})
			expect(before).not.toHaveBeenCalled()
			expect(after).not.toHaveBeenCalled()
			expect(eventBridge.emittedEvents).not.toContain('echo.completed')
		} finally {
			await stopMounted(mounted)
		}
	})

	it('rejects nested aggregate delivery and public dependency delivery', async () => {
		const eventBridge = new InspectableEventBridge()
		const provider = new FakeModelProvider({ strict: true })
		const mounted = await startMounted({ eventBridge, ai: { model: { provider, model: 'fake' } } })
		try {
			const rootReceiver = eventBridge.commandReceivers.get(rootTargetName)
			if (!rootReceiver) throw new Error('Expected the root command receiver.')
			const nestedAggregate = getCommandMessageMock({
				receiver: rootAddress,
				payload: { payload: { value: 'forbidden' }, parameter: {} },
				harness: unsafeTransport(dispatchEnvelope()),
			})
			expect(commandErrorStatus(await rootReceiver(nestedAggregate))).toBe(400)

			const dependencyProjection = projectionsFor().find(row => row.target.id === dependencyTargetName)
			if (!dependencyProjection) throw new Error('Expected the dependency projection.')
			const publicDependencyEnvelope = {
				contract: { schemaVersion: 1 as const, exportDigest: dependencyProjection.exportDigest },
				root: { sessionId: 'public-dependency' },
			}
			const dependencyFrames = await collect(
				await eventBridge.openStream(
					streamRequest({ value: 'public dependency' }, dependencyTargetName, publicDependencyEnvelope),
				),
			)
			expect(dependencyFrames).toEqual([
				expect.objectContaining({ frameType: 'error', error: expect.objectContaining({ status: 403 }) }),
			])
			expect(provider.requests).toHaveLength(0)
		} finally {
			await stopMounted(mounted)
		}
	})

	it('binds the nested direct run id to dispatch.invocationId', async () => {
		const mounted = await startMounted()
		try {
			const frames = await collect(
				await mounted.eventBridge.openStream(
					streamRequest(
						{ value: 'nested identity' },
						rootTargetName,
						dispatchEnvelope({ invocationId: 'exact-child-invocation' }),
					),
				),
			)
			const chunks = frames.filter(frame => frame.frameType === 'chunk').map(frame => frame.chunk)
			expect(chunks).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ type: 'run.started', runId: 'exact-child-invocation' }),
					expect.objectContaining({
						type: 'run.finished',
						runId: 'exact-child-invocation',
						outcome: expect.objectContaining({ runId: 'exact-child-invocation' }),
					}),
				]),
			)
		} finally {
			await stopMounted(mounted)
		}
	})

	it('executes a dependency only through its nested stream route', async () => {
		const dependency = projectionsFor().find(row => row.target.id === dependencyTargetName)
		if (!dependency) throw new Error('Expected the dependency projection.')
		const envelope = {
			contract: { schemaVersion: 1 as const, exportDigest: dependency.exportDigest },
			dispatch: dispatchEnvelope({ invocationId: 'dependency-invocation' }).dispatch,
		}
		const mounted = await startMounted()
		try {
			const frames = await collect(
				await mounted.eventBridge.openStream(
					streamRequest({ value: 'nested dependency' }, dependencyTargetName, envelope),
				),
			)
			expect(frames.at(-1)).toMatchObject({
				frameType: 'complete',
				final: { status: 'completed', runId: 'dependency-invocation' },
			})
		} finally {
			await stopMounted(mounted)
		}
	})

	it.each([
		['missing envelope', (base: Command) => ({ ...base, harness: undefined })],
		[
			'mixed root and dispatch envelope',
			(base: Command) => ({ ...base, harness: { ...rootEnvelope(), dispatch: dispatchEnvelope().dispatch } }),
		],
		[
			'ambiguous nested ancestry',
			(base: Command) => ({
				...base,
				harness: dispatchEnvelope({ parentAgentId: 'agent', parentWorkflowId: 'workflow' }),
			}),
		],
		[
			'malformed contract',
			(base: Command) => ({
				...base,
				harness: { contract: { schemaVersion: 2, exportDigest: 'bad' }, root: { sessionId: 's' } },
			}),
		],
		['wrong message kind', (base: Command) => ({ ...base, messageType: EBMessageType.Stream })],
		['wrong address', (base: Command) => ({ ...base, receiver: { ...base.receiver, serviceVersion: '99' } })],
		[
			'wrong digest',
			(base: Command) => ({
				...base,
				harness: {
					...rootEnvelope(),
					contract: { schemaVersion: 1, exportDigest: `sha256:${'0'.repeat(64)}` },
				},
			}),
		],
		['non-JSON wire input', (base: Command) => ({ ...base, payload: { ...base.payload, payload: { value: 1n } } })],
	] as const)('rejects %s before transform, guard, or handler effects', async (_label, mutate) => {
		const fixture = instrumentedDefinition()
		const eventBridge = new InspectableEventBridge()
		const mounted = await startMounted({ definition: fixture.definition, policy: fixture.policy, eventBridge, ai: {} })
		try {
			const receiver = eventBridge.commandReceivers.get(fixture.workflow.id)
			if (!receiver) throw new Error('Expected the instrumented command receiver.')
			const projection = projectionsFor(fixture.definition, fixture.policy)[0]
			if (!projection) throw new Error('Expected the instrumented projection.')
			const base = getCommandMessageMock({
				receiver: projection.address,
				payload: { payload: { value: 'safe' }, parameter: {} },
				harness: rootEnvelope(fixture.definition, fixture.policy, 'effect-session', fixture.workflow.id),
			})
			const response = await receiver(unsafeTransport(mutate(base)))
			expect(commandErrorStatus(response)).toBeGreaterThanOrEqual(400)
			expect(fixture.effects).toEqual({ transforms: 0, guards: 0, handlers: 0 })
		} finally {
			await stopMounted(mounted)
		}
	})

	it.each([
		{
			name: 'missing direct start',
			events: [directTerminal],
			phase: 'pre-start' as const,
		},
		{
			name: 'missing direct terminal',
			events: [directStart],
			phase: 'post-start' as const,
		},
		{
			name: 'duplicate direct start',
			events: [directStart, { ...directStart, eventId: 'duplicate-start', sequence: 1 }],
			phase: 'post-start' as const,
		},
		{
			name: 'duplicate direct terminal',
			events: [directStart, directTerminal, { ...directTerminal, eventId: 'duplicate-terminal', sequence: 2 }],
			phase: 'post-start' as const,
		},
		{
			name: 'post-terminal frame',
			events: [
				directStart,
				directTerminal,
				unsafeTransport<Event>({
					type: 'agent.started',
					runId: protocolRunId,
					eventId: 'post-terminal',
					sequence: 2,
					agentId: 'late-agent',
					at: '2026-09-09T00:00:02.000Z',
				}),
			],
			phase: 'post-start' as const,
		},
		{
			name: 'direct event presented as a descendant',
			events: [
				unsafeTransport<Event>({
					...directStart,
					parentRunId: 'foreign-parent',
					parentInvocationId: 'foreign-invocation',
				}),
			],
			phase: 'pre-start' as const,
		},
		{
			name: 'incomplete descendant ancestry',
			events: [
				directStart,
				unsafeTransport<Event>({
					type: 'agent.started',
					runId: 'descendant-run',
					eventId: 'bad-ancestry',
					sequence: 1,
					agentId: 'descendant',
					at: '2026-09-09T00:00:01.000Z',
					parentRunId: protocolRunId,
				}),
			],
			phase: 'post-start' as const,
		},
		{
			name: 'second direct run id',
			events: [
				directStart,
				{
					...directTerminal,
					runId: 'other-direct-run',
					outcome: { ...protocolOutcome, runId: 'other-direct-run' },
				},
			],
			phase: 'post-start' as const,
		},
		{
			name: 'canonical direct terminal/result mismatch',
			events: [directStart, directTerminal],
			result: {
				...protocolOutcome,
				output: { value: 'different authoritative output' },
			},
			phase: 'post-start' as const,
		},
	] satisfies readonly {
		name: string
		events: readonly Event[]
		result?: Terminal
		phase: 'pre-start' | 'post-start'
	}[])('fails closed for hosted stream corruption: $name', async scenario => {
		const fixture = await startProtocolFixture()
		fixture.replaceStream(scriptedHostedStream(scenario.events, scenario.result))
		try {
			await fixture.streamReceiver()(fixture.openMessage())
			assertProtocolFailure(fixture.eventBridge.emittedFrames, scenario.phase)
			expect(fixture.eventBridge.emittedEvents).not.toContain('protocol.completed')
		} finally {
			await fixture.stop()
		}
	})

	it('rejects a wrong-kind stream callback and ignores a non-stream frame without execution or cancellation', async () => {
		const fixture = await startProtocolFixture()
		const stream = scriptedHostedStream([])
		const streamHosted = fixture.replaceStream(stream)
		const receiver = fixture.streamReceiver()
		const open = fixture.openMessage()
		try {
			await expect(
				receiver(
					unsafeTransport({
						...open,
						messageType: EBMessageType.Command,
					}),
				),
			).rejects.toMatchObject({ errorCode: 400 })
			await expect(
				receiver(
					unsafeTransport({
						...open,
						payload: { frameType: 'not-a-stream-control' },
					}),
				),
			).resolves.toBeUndefined()
			expect(streamHosted).not.toHaveBeenCalled()
			expect(stream.cancel).not.toHaveBeenCalled()
			expect(fixture.eventBridge.emittedFrames).toEqual([])
			expect(fixture.eventBridge.emittedEvents).not.toContain('protocol.completed')
		} finally {
			await fixture.stop()
		}
	})

	it('fails same-id projections and service route collisions before receiver registration', async () => {
		const sameSchema = generatedModelSchema<string, string>({ type: 'string' })
		const sameAgent = defineAgent('sameTarget', {
			input: sameSchema,
			output: sameSchema,
			instructions: 'Return input.',
		})
		const sameWorkflow = defineWorkflow('sameTarget', {
			input: sameSchema,
			output: sameSchema,
			async handler(context) {
				return context.input
			},
		})
		const duplicate = defineHarness({ name: 'duplicateTargets' }).addAgent(sameAgent).addWorkflow(sameWorkflow)
		const duplicateBridge = new InspectableEventBridge()
		try {
			await expect(startMounted({ definition: duplicate, eventBridge: duplicateBridge })).rejects.toThrow(
				/invalid|collid|published more than once/i,
			)
			expect(duplicateBridge.commandRegistrations).toHaveLength(0)
			expect(duplicateBridge.streamRegistrations).toHaveLength(0)
		} finally {
			await duplicateBridge.destroy()
		}

		const collisionBridge = new InspectableEventBridge()
		await collisionBridge.start()
		const builder = mountedBuilder(mountedHarness)
		const collision = await builder
			.getCommandBuilder(rootTargetName, 'Conflicts with mounted root')
			.setCommandFunction(async function () {
				return { value: 'collision' }
			})
			.getDefinition()
		builder.addCommandDefinition(Promise.resolve(collision))
		try {
			await expect(
				builder.getInstance(
					collisionBridge,
					unsafeTransport({
						ai: { model: { provider: new FakeModelProvider(), model: 'fake' } },
					}),
				),
			).rejects.toThrow(/conflicts with a command address/i)
			expect(collisionBridge.commandRegistrations).toHaveLength(0)
			expect(collisionBridge.streamRegistrations).toHaveLength(0)
		} finally {
			await collisionBridge.destroy()
		}
	})
})
