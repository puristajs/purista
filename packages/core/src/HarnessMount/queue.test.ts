import {
	AgentAdmissionRejectedError,
	defineAgent,
	defineHarness,
	defineWorkflow,
	type JsonValue,
	ModelAdmissionRejectedError,
	type ModelSchema,
} from '@purista/harness'
import { describe, expect, it, vi } from 'vitest'

import { HandledError } from '../core/Error/HandledError.impl.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { toJSONSchema } from '../schema/index.js'
import { createMountedHarnessTargetProjections } from './projection.js'
import { createMountedHarnessQueueDefinitions, toHarnessQueueRetry } from './queue.js'
import { defineHarnessQueueBinding } from './queueBinding.js'
import { createHarnessQueueDeliveryEnvelope, readHarnessQueueInvocationIdentity } from './queueEnvelope.js'

const valueSchema = generatedSchema<{ value: string }>({
	type: 'object',
	additionalProperties: false,
	required: ['value'],
	properties: { value: { type: 'string' } },
})

const dependency = defineAgent('lookup', {
	model: 'chat',
	input: valueSchema,
	output: valueSchema,
	instructions: 'Look up a value.',
	prompt: input => ({ role: 'user', content: input.value }),
})

const root = defineAgent('answer', {
	model: 'chat',
	input: valueSchema,
	output: valueSchema,
	instructions: 'Answer with a value.',
	prompt: input => ({ role: 'user', content: input.value }),
	subagents: { lookup: dependency },
})

const definition = defineHarness({ name: 'queueRuntime', revision: 'queue-runtime-r1' }).addAgent(root)
const workflow = defineWorkflow('summarize', {
	input: valueSchema,
	output: valueSchema,
	async handler(context) {
		return context.input
	},
})
const workflowDefinition = defineHarness({ name: 'workflowQueueRuntime' }).addWorkflow(workflow)

describe('createMountedHarnessQueueDefinitions', () => {
	it('materializes the authentic supplied queue and exactly one worker for an explicit root', async () => {
		const fixture = queuedMount()
		const created = createMountedHarnessQueueDefinitions(fixture.mount)

		expect(created.queueDefinitions).toHaveLength(1)
		expect(created.queueWorkerDefinitions).toHaveLength(1)
		const [queueDefinition, workerDefinition] = await Promise.all([
			created.queueDefinitions[0],
			created.queueWorkerDefinitions[0],
		])
		expect(queueDefinition?.queueName).toBe('support.answer')
		expect(queueDefinition?.payloadSchema).not.toBe(root.contract.input)
		expect(await toJSONSchema(required(queueDefinition?.payloadSchema), { mode: 'input' })).toEqual(
			await toJSONSchema(root.contract.input, { mode: 'input' }),
		)
		const wire = { value: ' unchanged ' }
		expect(await queueDefinition?.payloadSchema?.['~standard'].validate(wire)).toEqual({ value: wire })
		expect(workerDefinition).toMatchObject({
			name: 'support-answer-worker',
			queueName: 'support.answer',
			maxParallelHandlers: 4,
		})
		expect(Object.keys(workerDefinition?.invokes ?? {})).toEqual(['Support'])
		expect(fixture.mount.projections.find(entry => entry.visibility === 'dependency')?.target.id).toBe('lookup')
	})

	it('uses a closed serializable envelope and preserves it unchanged across retry delivery', async () => {
		const created = createMountedHarnessQueueDefinitions(queuedMount().mount)
		const queueDefinition = await required(created.queueDefinitions[0])
		const workerDefinition = await required(created.queueWorkerDefinitions[0])
		const envelope = createHarnessQueueDeliveryEnvelope(
			{ sessionId: 'session-1', timeoutMs: 500, metadata: { source: 'queue-test' } },
			'invocation-1',
		)

		expect(Object.isFrozen(envelope)).toBe(true)
		expect(envelope).toEqual({
			schemaVersion: 1,
			invocationId: 'invocation-1',
			sessionId: 'session-1',
			parameter: { timeoutMs: 500, metadata: { source: 'queue-test' } },
		})
		expect(JSON.parse(JSON.stringify(envelope))).toEqual(envelope)
		expect(await queueDefinition.parameterSchema?.['~standard'].validate(envelope)).toEqual({ value: envelope })
		expect(await queueDefinition.parameterSchema?.['~standard'].validate({ ...envelope, extra: true })).toMatchObject({
			issues: expect.any(Array),
		})

		const run = vi.fn(async (_input: unknown, _parameter: unknown) => ({
			sessionId: envelope.sessionId,
			outcome: { status: 'completed', runId: 'run-1', output: { value: 'done' } },
		}))
		const message = queueMessage(envelope)
		const context = { agent: { Support: { '1': { answer: { run } } } } }
		const first = await workerDefinition.handler(context as never, message as never)
		const retryDelivery = await workerDefinition.handler(context as never, { ...message, attempt: 2 } as never)

		expect(first).toEqual({
			status: 'success',
			output: {
				sessionId: 'session-1',
				outcome: { status: 'completed', runId: 'run-1', output: { value: 'done' } },
			},
		})
		expect(retryDelivery).toEqual(first)
		expect(run).toHaveBeenCalledTimes(2)
		expect(run.mock.calls.map(call => call[1])).toEqual([
			{ sessionId: 'session-1', timeoutMs: 500, metadata: { source: 'queue-test' } },
			{ sessionId: 'session-1', timeoutMs: 500, metadata: { source: 'queue-test' } },
		])
		const firstParameter = required(run.mock.calls[0]?.[1])
		expect(readHarnessQueueInvocationIdentity(firstParameter as never)).toEqual({
			invocationId: 'invocation-1',
			sessionId: 'session-1',
		})
		expect(
			readHarnessQueueInvocationIdentity({ ...(firstParameter as Record<string, unknown>) } as never),
		).toBeUndefined()
		expect(readHarnessQueueInvocationIdentity(required(run.mock.calls[1]?.[1]) as never)).toEqual({
			invocationId: 'invocation-1',
			sessionId: 'session-1',
		})
	})

	it('fails malformed delivery envelopes before invoking the target', async () => {
		const worker = await required(createMountedHarnessQueueDefinitions(queuedMount().mount).queueWorkerDefinitions[0])
		const run = vi.fn()

		await expect(
			worker.handler(
				{ agent: { Support: { '1': { answer: { run } } } } } as never,
				queueMessage({ schemaVersion: 1, invocationId: '', sessionId: 'session-1', parameter: {} }) as never,
			),
		).rejects.toThrow('Harness queue delivery envelope is invalid.')
		expect(run).not.toHaveBeenCalled()
	})

	it('generates a workflow worker that invokes only the aggregate EventBridge client', async () => {
		const worker = await required(createMountedHarnessQueueDefinitions(queuedWorkflowMount()).queueWorkerDefinitions[0])
		const envelope = createHarnessQueueDeliveryEnvelope({ sessionId: 'workflow-session' }, 'workflow-invocation')
		const run = vi.fn(async () => ({
			sessionId: 'workflow-session',
			outcome: { status: 'interrupted', runId: 'workflow-run', interrupt: { type: 'custom', value: null } },
		}))

		await expect(
			worker.handler(
				{ workflow: { Support: { '1': { summarize: { run } } } } } as never,
				{ ...queueMessage(envelope), queueName: 'support.summarize' } as never,
			),
		).resolves.toEqual({
			status: 'success',
			output: {
				sessionId: 'workflow-session',
				outcome: { status: 'interrupted', runId: 'workflow-run', interrupt: { type: 'custom', value: null } },
			},
		})
		expect(run).toHaveBeenCalledWith({ value: 'question' }, { sessionId: 'workflow-session' })
	})

	it('maps admission failures in the generated worker and leaves ordinary failures untouched', async () => {
		const worker = await required(createMountedHarnessQueueDefinitions(queuedMount().mount).queueWorkerDefinitions[0])
		const admission = new ModelAdmissionRejectedError(1_250, {
			providerId: 'provider',
			model: 'model',
			credentialScope: 'tenant',
			operation: 'object',
		})
		const run = vi.fn().mockRejectedValueOnce(admission).mockRejectedValueOnce(new Error('failed'))
		const context = { agent: { Support: { '1': { answer: { run } } } } }
		const message = queueMessage(createHarnessQueueDeliveryEnvelope({ sessionId: 'session-1' }, 'invocation-1'))

		await expect(worker.handler(context as never, message as never)).resolves.toEqual({
			status: 'retry',
			reason: 'model_admission_rejected',
			delayMs: 1_250,
		})
		await expect(worker.handler(context as never, message as never)).rejects.toThrow('failed')
	})

	it('rejects repeat materialization and stale metadata before mutating builders', async () => {
		const fixture = queuedMount()
		createMountedHarnessQueueDefinitions(fixture.mount)
		expect(() => createMountedHarnessQueueDefinitions(fixture.mount)).toThrow(
			'Harness target queue binding has already been materialized.',
		)

		const other = queuedMount()
		const [projection, ...remaining] = other.mount.projections
		const rootProjection = required(projection)
		const staleMount = {
			...other.mount,
			projections: [
				{ ...rootProjection, targetExport: { ...rootProjection.targetExport, queue: { name: 'other.queue' } } },
				...remaining,
			],
		}
		expect(() => createMountedHarnessQueueDefinitions(staleMount as never)).toThrow(
			'Harness target queue projection does not match its authentic binding.',
		)
		await expect(other.queue.getDefinition()).resolves.toMatchObject({ payloadSchema: undefined })

		const copied = queuedMount()
		const copiedMount = {
			...copied.mount,
			policy: { targets: { agents: { answer: { queue: { ...copied.binding } } } } },
		}
		expect(() => createMountedHarnessQueueDefinitions(copiedMount as never)).toThrow(
			'Harness target queue binding is not the exact factory-created binding for this contract.',
		)
		await expect(copied.queue.getDefinition()).resolves.toMatchObject({ payloadSchema: undefined })
	})

	it('creates no implicit queue or worker for unqueued roots and dependencies', () => {
		const projections = createMountedHarnessTargetProjections(definition, {
			serviceName: 'Support',
			serviceVersion: '1',
		})
		expect(createMountedHarnessQueueDefinitions({ projections })).toEqual({
			queueDefinitions: [],
			queueWorkerDefinitions: [],
		})
	})
})

describe('Service handler Harness enqueue integration', () => {
	it('shares one in-flight queued definition resolution across concurrent exports', async () => {
		const fixture = queuedMount()
		const builder = new ServiceBuilder({
			serviceName: 'Support',
			serviceVersion: '1',
			serviceDescription: 'Concurrent queued export',
		}).mountHarness(definition, { targets: { agents: { answer: { queue: fixture.binding } } } })
		const [first, second] = await Promise.all([builder.getFullServiceDefinition(), builder.getFullServiceDefinition()])
		expect(first.queues).toHaveLength(1)
		expect(second.queueWorkers).toHaveLength(1)
		expect(second).toEqual(first)
	})
})

describe('toHarnessQueueRetry', () => {
	it('maps local and EventBridge admission errors to the requested queue delay', () => {
		const local = new ModelAdmissionRejectedError(1_250, {
			providerId: 'provider',
			model: 'model',
			credentialScope: 'tenant',
			operation: 'object',
		})
		const remote = new HandledError(StatusCode.TooManyRequests, 'capacity unavailable', {
			code: 'MODEL_ADMISSION_REJECTED',
			retriable: true,
			retryAfterMs: 2_500,
		})

		expect(toHarnessQueueRetry(local)).toEqual({
			status: 'retry',
			reason: 'model_admission_rejected',
			delayMs: 1_250,
		})
		expect(toHarnessQueueRetry(remote)).toEqual({
			status: 'retry',
			reason: 'model_admission_rejected',
			delayMs: 2_500,
		})
		expect(toHarnessQueueRetry(new AgentAdmissionRejectedError({ retryAfterMs: 750 }))).toEqual({
			status: 'retry',
			reason: 'agent_admission_rejected',
			delayMs: 750,
		})
		expect(
			toHarnessQueueRetry(
				new HandledError(StatusCode.TooManyRequests, 'capacity unavailable', {
					code: 'AGENT_ADMISSION_REJECTED',
					retriable: true,
					retryAfterMs: 900,
				}),
			),
		).toEqual({ status: 'retry', reason: 'agent_admission_rejected', delayMs: 900 })
	})

	it('does not reinterpret unrelated or malformed errors', () => {
		expect(toHarnessQueueRetry(new Error('failed'))).toBeUndefined()
		expect(toHarnessQueueRetry(new AgentAdmissionRejectedError())).toBeUndefined()
		expect(
			toHarnessQueueRetry(
				new HandledError(StatusCode.TooManyRequests, 'capacity unavailable', {
					code: 'MODEL_ADMISSION_REJECTED',
					retriable: true,
					retryAfterMs: -1,
				}),
			),
		).toBeUndefined()
	})
})

function queuedMount() {
	const queue = new QueueDefinitionBuilder('support.answer', 'Queue support answers')
	const worker = new QueueWorkerBuilder('support.answer', 'support-answer-worker').setMaxParallelHandlers(4)
	const binding = defineHarnessQueueBinding(root.contract, queue, worker)
	const policy = { targets: { agents: { answer: { queue: binding } } } }
	const projections = createMountedHarnessTargetProjections(definition, {
		serviceName: 'Support',
		serviceVersion: '1',
		policy,
	})
	const mount = Object.freeze({ definition, policy, projections }) as unknown as Parameters<
		typeof createMountedHarnessQueueDefinitions
	>[0]
	return { mount, queue, binding }
}

function queuedWorkflowMount(): Parameters<typeof createMountedHarnessQueueDefinitions>[0] {
	const queue = new QueueDefinitionBuilder('support.summarize', 'Queue support summaries')
	const worker = new QueueWorkerBuilder('support.summarize', 'support-summary-worker')
	const binding = defineHarnessQueueBinding(workflow.contract, queue, worker)
	const policy = { targets: { workflows: { summarize: { queue: binding } } } }
	const projections = createMountedHarnessTargetProjections(workflowDefinition, {
		serviceName: 'Support',
		serviceVersion: '1',
		policy,
	})
	return { policy, projections }
}

function queueMessage(parameter: unknown) {
	return {
		id: 'job-1',
		queueName: 'support.answer',
		payload: { value: 'question' },
		parameter,
		headers: {},
		createdAt: 1,
		attempt: 1,
		maxAttempts: 3,
		leaseExpiresAt: 2,
		leaseTtlMs: 1,
	}
}

function generatedSchema<Value extends JsonValue>(
	jsonSchema: Readonly<Record<string, unknown>>,
): ModelSchema<Value, Value> {
	return {
		'~standard': {
			version: 1,
			vendor: 'queue-runtime-test',
			validate(value: unknown) {
				return { value: value as Value }
			},
			types: undefined as unknown as { input: Value; output: Value },
			jsonSchema: { input: () => jsonSchema, output: () => jsonSchema },
		},
	} as unknown as ModelSchema<Value, Value>
}

function required<T>(value: T | undefined): T {
	if (value === undefined) throw new Error('Expected test fixture value.')
	return value
}
