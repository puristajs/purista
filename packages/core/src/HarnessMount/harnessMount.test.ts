import { defineAgent, defineHarness, defineWorkflow, type JsonValue, type ModelSchema } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'

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
		root: { sessionId },
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
		ai: { model: { provider: new FakeModelProvider(), model: 'fake' } },
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
			ai: { model: { provider: new FakeModelProvider(), model: 'fake' } },
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
