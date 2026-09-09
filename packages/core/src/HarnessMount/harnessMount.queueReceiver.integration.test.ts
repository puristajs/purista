import { defineHarness, defineWorkflow, type JsonValue, type ModelSchema } from '@purista/harness'
import { describe, expect, it, vi } from 'vitest'

import type { QueueEnqueueResult } from '../core/QueueBridge/types/QueueEnqueueResult.js'
import type { QueueEnqueueOptions } from '../core/types/queue/QueueEnqueueOptions.js'
import type { QueueLease } from '../core/types/queue/QueueLease.js'
import { DefaultEventBridge } from '../DefaultEventBridge/DefaultEventBridge.impl.js'
import { getQueueBridgeMock } from '../mocks/getQueueBridge.mock.js'
import { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { defineHarnessQueueBinding } from './queueBinding.js'
import { createHarnessQueueDeliveryEnvelope } from './queueEnvelope.js'

describe('P4-046 queued mounted Harness receiver integration', () => {
	it('keeps raw wire input at enqueue and transforms it exactly once at the mounted receiver', async () => {
		const effects = { transforms: 0, targetInputs: [] as unknown[] }
		const wireSchema = generatedSchema<{ wire: string }, { value: string }>(
			{
				type: 'object',
				additionalProperties: false,
				required: ['wire'],
				properties: { wire: { type: 'string' } },
			},
			{
				type: 'object',
				additionalProperties: false,
				required: ['value'],
				properties: { value: { type: 'string' } },
			},
			input => {
				effects.transforms += 1
				return { value: input.wire.trim() }
			},
		)
		const valueSchema = generatedSchema<{ value: string }, { value: string }>({
			type: 'object',
			additionalProperties: false,
			required: ['value'],
			properties: { value: { type: 'string' } },
		})
		const workflow = defineWorkflow('normalize', {
			input: wireSchema,
			output: valueSchema,
			async handler(context) {
				effects.targetInputs.push(context.input)
				return context.input
			},
		})
		const definition = defineHarness({ name: 'queuedReceiver', revision: 'p4-046' }).addWorkflow(workflow)
		const queueName = 'harness.normalize'
		const queue = new QueueDefinitionBuilder(queueName, 'Normalize queued Harness input')
		const worker = new QueueWorkerBuilder(queueName, 'normalize-worker')
		const binding = defineHarnessQueueBinding(workflow.contract, queue, worker)
		const policy = { targets: { workflows: { normalize: { queue: binding } } } } as const
		const builder = new ServiceBuilder({
			serviceName: 'QueuedHarness',
			serviceVersion: '1',
			serviceDescription: 'P4-046 queued receiver regression fixture',
		}).mountHarness(definition, policy)

		const queueBridge = getQueueBridgeMock()
		let releaseLease: (lease: QueueLease) => void = () => undefined
		const firstLease = new Promise<QueueLease>(resolve => {
			releaseLease = resolve
		})
		let enqueued: QueueEnqueueOptions<unknown, unknown> | undefined
		queueBridge.stubs.leaseNext.onFirstCall().returns(firstLease)
		queueBridge.stubs.enqueue.callsFake(
			async (request: QueueEnqueueOptions<unknown, unknown>): Promise<QueueEnqueueResult> => {
				enqueued = request
				return { jobId: 'queued-job', queueName: request.queueName }
			},
		)

		const eventBridge = new DefaultEventBridge()
		const invoke = vi.spyOn(eventBridge, 'invoke')
		await eventBridge.start()
		const service = await builder.getInstance(eventBridge, {
			queueBridge: queueBridge.mock,
			ai: {},
		} as never)
		await service.start()

		try {
			const rawWireInput = { wire: '  transformed once  ' }
			const invocationId = 'queue-invocation-stable'
			const sessionId = 'queue-session-stable'
			const envelope = createHarnessQueueDeliveryEnvelope({ sessionId }, invocationId)
			const receipt = await (
				service as unknown as {
					enqueueQueue(queueName: string, payload: unknown, parameter: unknown): Promise<QueueEnqueueResult>
				}
			).enqueueQueue(queueName, rawWireInput, envelope)

			expect(receipt).toEqual({ jobId: 'queued-job', queueName })
			expect(enqueued?.payload).toBe(rawWireInput)
			expect(enqueued?.parameter).toBe(envelope)
			expect(effects.transforms).toBe(0)
			expect(effects.targetInputs).toEqual([])

			const request = required(enqueued)
			releaseLease({
				id: 'lease-id',
				leaseId: 'queue-lease',
				queueName,
				message: {
					id: 'queued-job',
					queueName,
					payload: request.payload,
					parameter: request.parameter,
					headers: request.headers ?? {},
					createdAt: 1,
					attempt: 1,
					maxAttempts: request.maxAttempts ?? 3,
					leaseExpiresAt: 60_001,
					leaseTtlMs: request.leaseTtlMs ?? 60_000,
				},
				leasedAt: 1,
				leaseExpiresAt: 60_001,
			})

			await vi.waitFor(() => expect(queueBridge.stubs.ack.calledOnce).toBe(true))
			expect(effects.transforms).toBe(1)
			expect(effects.targetInputs).toEqual([{ value: 'transformed once' }])
			expect(invoke).toHaveBeenCalledTimes(1)
			expect(invoke.mock.calls[0]?.[0].harness?.root).toEqual({ invocationId, sessionId })
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})
})

function generatedSchema<Input extends JsonValue, Output extends JsonValue>(
	inputJsonSchema: Readonly<Record<string, unknown>>,
	outputJsonSchema: Readonly<Record<string, unknown>> = inputJsonSchema,
	transform: (value: Input) => Output = value => value as unknown as Output,
): ModelSchema<Input, Output> {
	return {
		'~standard': {
			version: 1,
			vendor: 'p4-046-queue-receiver',
			validate(value: unknown) {
				return { value: transform(value as Input) }
			},
			types: undefined as unknown as { input: Input; output: Output },
			jsonSchema: { input: () => inputJsonSchema, output: () => outputJsonSchema },
		},
	} as unknown as ModelSchema<Input, Output>
}

function required<T>(value: T | undefined): T {
	if (value === undefined) throw new Error('Expected the queued request.')
	return value
}
