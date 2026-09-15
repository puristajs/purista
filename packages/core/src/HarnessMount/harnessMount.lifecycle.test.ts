import { defineAgent, defineHarness, type HarnessTargetRunOutcome, type JsonValue } from '@purista/harness'
import { createHostOwnerToken } from '@purista/harness/integrator'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { Service } from '../core/Service/Service.impl.js'
import { EBMessageType } from '../core/types/EBMessageType.enum.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import { DefaultEventBridge } from '../DefaultEventBridge/DefaultEventBridge.impl.js'
import { getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
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

type CommandRequest = Parameters<DefaultEventBridge['invoke']>[0]
type StreamRequest = Parameters<DefaultEventBridge['openStream']>[0]
type Value = { value: string }

class FailingRegistrationBridge extends DefaultEventBridge {
	readonly lifecycle: string[] = []

	override async registerCommand(...args: Parameters<DefaultEventBridge['registerCommand']>): Promise<string> {
		this.lifecycle.push(`register-command:${args[0].serviceTarget}`)
		return super.registerCommand(...args)
	}

	override async registerStream(...args: Parameters<DefaultEventBridge['registerStream']>): Promise<string> {
		this.lifecycle.push(`register-stream:${args[0].serviceTarget}`)
		if (args[0].serviceTarget === rootTargetName) throw registrationFailure
		return super.registerStream(...args)
	}

	override async unregisterCommand(...args: Parameters<DefaultEventBridge['unregisterCommand']>): Promise<void> {
		this.lifecycle.push(`unregister-command:${args[0].serviceTarget}`)
		return super.unregisterCommand(...args)
	}

	override async unregisterStream(...args: Parameters<DefaultEventBridge['unregisterStream']>): Promise<void> {
		this.lifecycle.push(`unregister-stream:${args[0].serviceTarget}`)
		return super.unregisterStream(...args)
	}
}

const registrationFailure = new Error('registration-failure-sentinel')
const customDestroyFailure = new Error('custom-destroy-failure-sentinel')
const customStartFailure = new Error('custom-start-failure-sentinel')
type LifecycleMode = 'normal' | 'destroy-fails' | 'start-fails'

class LifecycleService extends Service {
	static mode: LifecycleMode = 'normal'
	customCleanupCalls = 0
	ordinaryCleanupCalls = 0

	override async start(): Promise<void> {
		if (LifecycleService.mode === 'start-fails') throw customStartFailure
		await super.start()
	}

	override async destroy(): Promise<void> {
		this.customCleanupCalls += 1
		await super.destroy()
		this.ordinaryCleanupCalls += 1
		if (LifecycleService.mode === 'destroy-fails') throw customDestroyFailure
	}
}

async function mountedLifecycleService(mode: LifecycleMode) {
	LifecycleService.mode = mode
	const eventBridge = new DefaultEventBridge()
	await eventBridge.start()
	const builder = mountedBuilder().setCustomClass(LifecycleService)
	const runtimeOptions = {
		ai: { models: { chat: { provider: new FakeModelProvider(), model: 'fake' } } },
	} as unknown as Parameters<typeof builder.getInstance>[1]
	const service = await builder.getInstance(eventBridge, runtimeOptions)
	return { eventBridge, service }
}

function rootCommand(payload: JsonValue, policy?: AnyMountPolicy): CommandRequest {
	return rootCommandRequest(payload, { policy }) as CommandRequest
}

function rootStream(payload: JsonValue, policy?: AnyMountPolicy): StreamRequest {
	const command = rootCommandRequest(payload, { policy })
	return {
		...command,
		payload: { frameType: 'open', payload, parameter: {} },
		harness: rootEnvelope(mountedHarness, policy),
	} as StreamRequest
}

async function streamPayloads(stream: AsyncIterable<{ payload: unknown }>): Promise<unknown[]> {
	const frames: unknown[] = []
	for await (const frame of stream) frames.push(frame.payload)
	return frames
}

async function stopAfterPendingMessages(mounted: Awaited<ReturnType<typeof startMounted>>): Promise<void> {
	await new Promise(resolve => setImmediate(resolve))
	await stopMounted(mounted)
}

describe('mounted Harness lifecycle and completed-event semantics', () => {
	it('starts ordinary service receivers before mounted Harness roots', async () => {
		const ordinaryStart = vi.spyOn(Service.prototype, 'start')
		const harnessStart = vi.spyOn(HarnessMountRuntime.prototype, 'start')
		const mounted = await mountedLifecycleService('normal')
		try {
			await mounted.service.start()
			expect(ordinaryStart).toHaveBeenCalledOnce()
			expect(harnessStart).toHaveBeenCalledOnce()
			expect(ordinaryStart.mock.invocationCallOrder[0]).toBeLessThan(harnessStart.mock.invocationCallOrder[0])
		} finally {
			await mounted.service.destroy()
			await new Promise<void>(resolve => setImmediate(resolve))
			await mounted.eventBridge.destroy()
			ordinaryStart.mockRestore()
			harnessStart.mockRestore()
		}
	})

	it('publishes only the strongly typed completed root outcome after after-guards and registers no event receiver', async () => {
		const order: string[] = []
		const audit = vi.fn((_context: unknown, outcome: HarnessTargetRunOutcome<typeof rootWorkflow.contract>) => {
			expectTypeOf(outcome).toEqualTypeOf<HarnessTargetRunOutcome<typeof rootWorkflow.contract>>()
			order.push(outcome.status)
		})
		const policy = {
			workflows: { [rootTargetName]: { afterGuards: { audit }, successEvent: 'harness.echo.completed' } },
		} as unknown as AnyMountPolicy
		const mounted = await startMounted({ policy })
		try {
			await mounted.eventBridge.registerSubscription(
				{
					sender: rootAddress,
					eventName: 'harness.echo.completed',
					subscriber: { serviceName: 'Audit', serviceVersion: '1', serviceTarget: 'record' },
					eventBridgeConfig: { durable: false, autoacknowledge: true, shared: true },
				},
				async () => undefined,
			)
			const emitMessage = vi.spyOn(mounted.eventBridge, 'emitMessage')
			const response = await mounted.eventBridge.invoke(rootCommand({ value: 'event' }, policy))
			expect(response).toMatchObject({ outcome: { status: 'completed', output: { value: 'event' } } })
			expect(order).toEqual(['completed'])
			const completed = emitMessage.mock.calls
				.map(([message]) => message)
				.filter(
					message =>
						message.messageType === EBMessageType.CustomMessage && message.eventName === 'harness.echo.completed',
				)
			expect(completed).toHaveLength(1)
			expect(completed[0]).toMatchObject({
				sender: { ...rootAddress, instanceId: mounted.eventBridge.instanceId },
				payload: { status: 'completed', output: { value: 'event' } },
			})
			expect(
				projectionsFor(mountedHarness, policy).find(row => row.target.id === rootTargetName)?.completedEvent,
			).toBeDefined()
			expect(
				projectionsFor(mountedHarness, policy).find(row => row.visibility === 'dependency')?.completedEvent,
			).toBeUndefined()
		} finally {
			await stopAfterPendingMessages(mounted)
		}
	})

	it('registers completed roots as command/stream receivers and dependency targets as stream-only receivers', async () => {
		const policy = {
			workflows: { [rootTargetName]: { successEvent: 'harness.echo.completed' } },
		} as unknown as AnyMountPolicy
		const eventBridge = new DefaultEventBridge()
		const registerCommand = vi.spyOn(eventBridge, 'registerCommand')
		const registerStream = vi.spyOn(eventBridge, 'registerStream')
		const mounted = await startMounted({ policy, eventBridge })
		try {
			expect(registerCommand.mock.calls.map(([address]) => address.serviceTarget)).toEqual([rootTargetName])
			expect(registerStream.mock.calls.map(([address]) => address.serviceTarget).sort()).toEqual([
				rootTargetName,
				'privateLookup',
			])
		} finally {
			await new Promise(resolve => setImmediate(resolve))
			await stopAfterPendingMessages(mounted)
		}
	})

	it('sanitizes aggregate publication failure to a 500 response', async () => {
		const policy = {
			workflows: { [rootTargetName]: { successEvent: 'harness.echo.completed' } },
		} as unknown as AnyMountPolicy
		const mounted = await startMounted({ policy })
		try {
			const emit = mounted.eventBridge.emitMessage.bind(mounted.eventBridge)
			vi.spyOn(mounted.eventBridge, 'emitMessage').mockImplementation(async message => {
				if (message.messageType === EBMessageType.CustomMessage && message.eventName === 'harness.echo.completed')
					throw new Error('private publication failure')
				return emit(message)
			})
			const error = await mounted.eventBridge.invoke(rootCommand({ value: 'publish' }, policy)).catch(reason => reason)
			expect(error).toMatchObject({ errorCode: StatusCode.InternalServerError })
			expect(JSON.stringify(error)).not.toContain('private publication failure')
		} finally {
			await stopAfterPendingMessages(mounted)
		}
	})

	it('replaces a post-start publication failure with one failed terminal and matching complete final', async () => {
		const policy = {
			workflows: { [rootTargetName]: { successEvent: 'harness.echo.completed' } },
		} as unknown as AnyMountPolicy
		const mounted = await startMounted({ policy })
		try {
			const emit = mounted.eventBridge.emitMessage.bind(mounted.eventBridge)
			vi.spyOn(mounted.eventBridge, 'emitMessage').mockImplementation(async message => {
				if (message.messageType === EBMessageType.CustomMessage && message.eventName === 'harness.echo.completed')
					throw new Error('private publication failure')
				return emit(message)
			})
			const frames = await streamPayloads(await mounted.eventBridge.openStream(rootStream({ value: 'stream' }, policy)))
			const terminals = frames.filter(
				(
					frame,
				): frame is {
					frameType: 'chunk'
					chunk: { type: 'run.finished'; outcome: { status: string; runId: string } }
				} =>
					typeof frame === 'object' &&
					frame !== null &&
					(frame as { frameType?: unknown }).frameType === 'chunk' &&
					typeof (frame as { chunk?: unknown }).chunk === 'object' &&
					(frame as { chunk: { type?: unknown } }).chunk.type === 'run.finished',
			)
			const complete = frames.find(
				(frame): frame is { frameType: 'complete'; final: { status: string; runId: string } } =>
					typeof frame === 'object' && frame !== null && (frame as { frameType?: unknown }).frameType === 'complete',
			)
			expect(terminals).toHaveLength(1)
			expect(terminals[0]?.chunk.outcome.status).toBe('failed')
			expect(complete?.final).toEqual(terminals[0]?.chunk.outcome)
		} finally {
			await stopAfterPendingMessages(mounted)
		}
	})

	it('rolls back partial registration in reverse order and makes repeated shutdown inert', async () => {
		const eventBridge = new FailingRegistrationBridge()
		await eventBridge.start()
		const builder = mountedBuilder()
		const runtimeOptions = {
			ai: { models: { chat: { provider: new FakeModelProvider(), model: 'fake' } } },
		} as unknown as Parameters<typeof builder.getInstance>[1]
		const service = await builder.getInstance(eventBridge, runtimeOptions)
		try {
			await expect(service.start()).rejects.toBe(registrationFailure)
			expect(eventBridge.lifecycle).toEqual([
				`register-stream:${dependencyTargetName}`,
				`register-command:${rootTargetName}`,
				`register-stream:${rootTargetName}`,
				`unregister-command:${rootTargetName}`,
				`unregister-stream:${dependencyTargetName}`,
			])
			await service.destroy()
			await service.destroy()
			expect(eventBridge.lifecycle).toHaveLength(5)
		} finally {
			await new Promise(resolve => setImmediate(resolve))
			await eventBridge.destroy()
		}
	})

	it('replays a direct-agent idempotent delivery with a stable run ID and one publication attempt per receiver execution', async () => {
		const agent = defineAgent('idempotentAgent', {
			model: 'chat',
			instructions: 'Return the supplied value.',
			input: generatedModelSchema<Value, Value>({
				type: 'object',
				additionalProperties: false,
				required: ['value'],
				properties: { value: { type: 'string' } },
			}),
			output: generatedModelSchema<Value, Value>({
				type: 'object',
				additionalProperties: false,
				required: ['value'],
				properties: { value: { type: 'string' } },
			}),
			prompt: input => ({ role: 'user', content: input.value }),
		})
		const definition = defineHarness({ name: 'idempotentAgentHarness', revision: 'idempotent-agent-r1' }).addAgent(
			agent,
		)
		const policy = {
			agents: { idempotentAgent: { successEvent: 'harness.agent.completed' } },
		} as unknown as AnyMountPolicy
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { value: 'redelivered' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})
		const mounted = await startMounted({
			definition,
			policy,
			ai: { models: { chat: { provider, model: 'fake' } } },
		} as unknown as Parameters<typeof startMounted>[0])
		try {
			await mounted.eventBridge.registerSubscription(
				{
					sender: { ...rootAddress, serviceTarget: agent.id },
					eventName: 'harness.agent.completed',
					subscriber: { serviceName: 'Audit', serviceVersion: '1', serviceTarget: 'record' },
					eventBridgeConfig: { durable: false, autoacknowledge: true, shared: true },
				},
				async () => undefined,
			)
			const emitMessage = vi.spyOn(mounted.eventBridge, 'emitMessage')
			const request = () =>
				rootCommandRequest({ value: 'redelivered' }, {
					definition,
					policy,
					targetName: agent.id,
					sessionId: 'retry-session',
					parameter: { idempotencyKey: 'delivery-1' },
				} as unknown as Parameters<typeof rootCommandRequest>[1]) as CommandRequest
			const first = (await mounted.eventBridge.invoke(request())) as { outcome: { status: string; runId: string } }
			const second = (await mounted.eventBridge.invoke(request())) as { outcome: { status: string; runId: string } }
			expect(first.outcome).toMatchObject({ status: 'completed' })
			expect(second.outcome).toMatchObject({ status: 'completed', runId: first.outcome.runId })
			expect(provider.requests).toHaveLength(1)
			provider.assertExhausted()
			const publications = emitMessage.mock.calls
				.map(([message]) => message)
				.filter(
					message =>
						message.messageType === EBMessageType.CustomMessage && message.eventName === 'harness.agent.completed',
				)
			expect(publications).toHaveLength(2)
			expect(publications.map(message => (message.payload as { runId: string }).runId)).toEqual([
				first.outcome.runId,
				first.outcome.runId,
			])
		} finally {
			await stopAfterPendingMessages(mounted)
		}
	})

	it('memoizes concurrent mounted-service destroy calls and runs custom and ordinary cleanup once', async () => {
		const mounted = await mountedLifecycleService('normal')
		try {
			await mounted.service.start()
			const first = mounted.service.destroy()
			const second = mounted.service.destroy()
			expect(second).toBe(first)
			await Promise.all([first, second])
			expect(mounted.service.customCleanupCalls).toBe(1)
			expect(mounted.service.ordinaryCleanupCalls).toBe(1)
		} finally {
			await new Promise(resolve => setImmediate(resolve))
			await mounted.eventBridge.destroy()
		}
	})

	it('replays the same custom destroy rejection without repeating cleanup', async () => {
		const mounted = await mountedLifecycleService('destroy-fails')
		try {
			await mounted.service.start()
			const first = mounted.service.destroy()
			const second = mounted.service.destroy()
			expect(second).toBe(first)
			await expect(first).rejects.toBe(customDestroyFailure)
			await expect(second).rejects.toBe(customDestroyFailure)
			expect(mounted.service.customCleanupCalls).toBe(1)
			expect(mounted.service.ordinaryCleanupCalls).toBe(1)
		} finally {
			await new Promise(resolve => setImmediate(resolve))
			await mounted.eventBridge.destroy()
		}
	})

	it('does not repeat ordinary teardown when a rejected mounted-service start is followed by destroy', async () => {
		const mounted = await mountedLifecycleService('start-fails')
		try {
			await expect(mounted.service.start()).rejects.toBe(customStartFailure)
			await mounted.service.destroy()
			expect(mounted.service.customCleanupCalls).toBe(1)
			expect(mounted.service.ordinaryCleanupCalls).toBe(1)
		} finally {
			await new Promise(resolve => setImmediate(resolve))
			await mounted.eventBridge.destroy()
		}
	})

	it('rejects a boolean-false ordinary event collision before runtime startup and shuts down only once', async () => {
		const policy = {
			workflows: { [rootTargetName]: { successEvent: 'harness.echo.completed' } },
		} as unknown as AnyMountPolicy
		const bridge = getEventBridgeMock()
		const logger = getLoggerMock()
		const mount: HarnessMount = Object.freeze({
			definition: mountedHarness,
			projections: projectionsFor(mountedHarness, policy),
			policy,
		})
		const runtimeOptions = {
			serviceName: rootAddress.serviceName,
			serviceVersion: rootAddress.serviceVersion,
			eventBridge: bridge.mock,
			logger: logger.mock,
			mount,
			config: {},
			resources: {},
			createHostContext: () => ({}) as PuristaToolContext,
			hostOwner: createHostOwnerToken<PuristaToolContext>(),
			occupied: { commands: [], streams: [], events: { 'harness.echo.completed': false } },
		} as unknown as ConstructorParameters<typeof HarnessMountRuntime>[0]
		const runtime = new HarnessMountRuntime(runtimeOptions)
		expect(() => runtime.preflight()).toThrow('Harness completed-event schema collision.')
		await runtime.shutdown()
		await runtime.shutdown()
		expect(bridge.stubs.unregisterCommand.called).toBe(false)
		expect(bridge.stubs.unregisterStream.called).toBe(false)
	})
})
