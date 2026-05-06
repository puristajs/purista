import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { getEventBridgeMock, getLoggerMock, getQueueBridgeMock } from '../../mocks/index.js'
import { getCustomMessageMessageMock } from '../../mocks/messages/getCustomMessage.mock.js'
import { QueueDefinitionBuilder } from '../../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import { QueueWorkerBuilder } from '../../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import { Service } from './Service.impl.js'

const serviceInfo = {
	serviceName: 'QueueRuntimeService',
	serviceVersion: '1',
	serviceDescription: 'queue runtime semantics tests',
}

const createMessage = (queueName = 'jobs') => ({
	id: 'job-1',
	queueName,
	payload: { id: 'p-1' },
	headers: {
		'purista.principalId': 'principal-1',
		'purista.tenantId': 'tenant-1',
	},
	createdAt: Date.now(),
	attempt: 1,
	maxAttempts: 3,
	leaseExpiresAt: Date.now() + 60_000,
	leaseTtlMs: 60_000,
	traceId: 'trace-1',
	correlationId: 'correlation-1',
})

const runOneLeasedJob = async (service: Service, queueBridge: ReturnType<typeof getQueueBridgeMock>, worker: any) => {
	queueBridge.stubs.leaseNext.onFirstCall().resolves({
		id: 'job-1',
		leaseId: 'lease-1',
		queueName: 'jobs',
		message: createMessage(),
		leasedAt: Date.now(),
		leaseExpiresAt: Date.now() + 60_000,
	})
	queueBridge.stubs.leaseNext.onSecondCall().callsFake(async () => {
		;(service as any).queueWorkersShouldStop = true
		return undefined
	})
	;(service as any).queueWorkersShouldStop = false

	await (service as any).runQueueWorker(worker, 0)
}

describe('queue runtime semantics', () => {
	it('exposes a cooperative cancellation signal and aborts it at max runtime', async () => {
		vi.useFakeTimers()
		try {
			const logger = getLoggerMock().mock
			const eventBridge = getEventBridgeMock().mock
			const queueBridge = getQueueBridgeMock()
			let observedSignal: AbortSignal | undefined
			let cancelRequestedBeforeAbort: boolean | undefined

			const queueDefinition = await new QueueDefinitionBuilder('jobs', 'jobs')
				.setExecutionProfile('longRunning', { maxRuntimeMs: 50 })
				.getDefinition()
			const worker = await new QueueWorkerBuilder('jobs', 'worker')
				.setHandler(async context => {
					observedSignal = context.signal
					cancelRequestedBeforeAbort = context.job.cancelRequested()
					await new Promise<void>(resolve => context.signal.addEventListener('abort', () => resolve(), { once: true }))
					return { status: 'retry', reason: 'max_runtime_exceeded' }
				})
				.getDefinition()

			const service = new Service({
				logger,
				eventBridge,
				queueBridge: queueBridge.mock,
				info: serviceInfo,
				commandDefinitionList: [],
				subscriptionDefinitionList: [],
				streamDefinitionList: [],
				queueDefinitionList: [queueDefinition],
				queueWorkerDefinitionList: [worker],
				config: {},
			})

			const run = runOneLeasedJob(service, queueBridge, worker)
			await vi.advanceTimersByTimeAsync(50)
			await vi.advanceTimersByTimeAsync(200)
			await run

			expect(observedSignal).toBeInstanceOf(AbortSignal)
			expect(cancelRequestedBeforeAbort).toBe(false)
			expect(observedSignal?.aborted).toBe(true)
			expect(queueBridge.stubs.nack.callCount).toBe(1)
			expect(queueBridge.stubs.ack.callCount).toBe(0)
		} finally {
			vi.useRealTimers()
		}
	})

	it('emits required success result event before acking the queue job', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock({
			capabilities: {
				durableSubscriptions: true,
				manualAckSupported: true,
			},
		})
		eventBridge.stubs.emitMessage.resolves({})
		const queueBridge = getQueueBridgeMock()
		const queueDefinition = await new QueueDefinitionBuilder('jobs', 'jobs')
			.emitResultAsEvent('jobs.completed', { delivery: 'required' })
			.getDefinition()
		const worker = await new QueueWorkerBuilder('jobs', 'worker')
			.setHandler(async () => ({ status: 'success', output: { ok: true }, headers: { source: 'worker' } }))
			.getDefinition()
		const service = new Service({
			logger,
			eventBridge: eventBridge.mock,
			queueBridge: queueBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			streamDefinitionList: [],
			queueDefinitionList: [queueDefinition],
			queueWorkerDefinitionList: [worker],
			config: {},
		})

		await runOneLeasedJob(service, queueBridge, worker)

		expect(eventBridge.stubs.emitMessage.callCount).toBe(1)
		expect(eventBridge.stubs.emitMessage.calledBefore(queueBridge.stubs.ack)).toBe(true)
		expect(queueBridge.stubs.ack.callCount).toBe(1)
		expect(eventBridge.stubs.emitMessage.getCall(0).args[0]).toMatchObject({
			eventName: 'jobs.completed',
			payload: {
				jobId: 'job-1',
				queueName: 'jobs',
				status: 'success',
				attempt: 1,
				payload: { ok: true },
				headers: { source: 'worker' },
				traceId: 'trace-1',
				correlationId: 'correlation-1',
				tenantId: 'tenant-1',
				principalId: 'principal-1',
			},
		})
	})

	it('acks best-effort result delivery even when event emission fails', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock()
		eventBridge.stubs.emitMessage.rejects(new Error('event bridge down'))
		const queueBridge = getQueueBridgeMock()
		const queueDefinition = await new QueueDefinitionBuilder('jobs', 'jobs')
			.emitResultAsEvent('jobs.completed', { delivery: 'best-effort' })
			.getDefinition()
		const worker = await new QueueWorkerBuilder('jobs', 'worker')
			.setHandler(async () => ({ status: 'success', output: { ok: true } }))
			.getDefinition()
		const service = new Service({
			logger,
			eventBridge: eventBridge.mock,
			queueBridge: queueBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			streamDefinitionList: [],
			queueDefinitionList: [queueDefinition],
			queueWorkerDefinitionList: [worker],
			config: {},
		})

		await runOneLeasedJob(service, queueBridge, worker)

		expect(queueBridge.stubs.ack.callCount).toBe(1)
		expect(queueBridge.stubs.nack.callCount).toBe(0)
	})

	it('retries required result delivery when event emission fails', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock()
		eventBridge.stubs.emitMessage.rejects(new Error('event bridge down'))
		const queueBridge = getQueueBridgeMock()
		const queueDefinition = await new QueueDefinitionBuilder('jobs', 'jobs')
			.emitResultAsEvent('jobs.completed', { delivery: 'required' })
			.getDefinition()
		const worker = await new QueueWorkerBuilder('jobs', 'worker')
			.setHandler(async () => ({ status: 'success', output: { ok: true } }))
			.getDefinition()
		const service = new Service({
			logger,
			eventBridge: eventBridge.mock,
			queueBridge: queueBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			streamDefinitionList: [],
			queueDefinitionList: [queueDefinition],
			queueWorkerDefinitionList: [worker],
			config: {},
		})

		await runOneLeasedJob(service, queueBridge, worker)

		expect(queueBridge.stubs.ack.callCount).toBe(0)
		expect(queueBridge.stubs.nack.callCount).toBe(1)
	})

	it('persists result state when a queue job store is available on the service instance', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock
		const queueBridge = getQueueBridgeMock()
		const queueJobStore = {
			get: vi.fn(),
			set: vi.fn().mockResolvedValue(undefined),
		}
		const queueDefinition = await new QueueDefinitionBuilder('jobs', 'jobs')
			.setResultPolicy({ mode: 'state', delivery: 'required', ttlMs: 1234 })
			.getDefinition()
		const worker = await new QueueWorkerBuilder('jobs', 'worker')
			.setHandler(async () => ({ status: 'success', output: { ok: true } }))
			.getDefinition()
		const service = new Service({
			logger,
			eventBridge,
			queueBridge: queueBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			streamDefinitionList: [],
			queueDefinitionList: [queueDefinition],
			queueWorkerDefinitionList: [worker],
			config: {},
		})
		;(service as any).queueJobStore = queueJobStore

		await runOneLeasedJob(service, queueBridge, worker)

		expect(queueJobStore.set).toHaveBeenCalledWith(
			expect.objectContaining({
				jobId: 'job-1',
				queueName: 'jobs',
				status: 'success',
				result: { ok: true },
			}),
			1234,
		)
		expect(queueBridge.stubs.ack.callCount).toBe(1)
	})

	it('expands event-to-queue bindings into bounded subscription runtime handling', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock({
			capabilities: {
				durableSubscriptions: true,
				manualAckSupported: true,
			},
		})
		eventBridge.stubs.emitMessage.resolves({})
		const queueBridge = getQueueBridgeMock()
		const queueDefinition = await new QueueDefinitionBuilder('jobs', 'jobs')
			.addPayloadSchema(z.object({ id: z.string() }))
			.addParameterSchema(z.object({ tenant: z.string() }))
			.getDefinition()
		const service = new Service({
			logger,
			eventBridge: eventBridge.mock,
			queueBridge: queueBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			streamDefinitionList: [],
			queueDefinitionList: [queueDefinition],
			queueWorkerDefinitionList: [],
			config: {},
			eventToQueueBindingList: [
				{
					eventName: 'source.event',
					queueName: 'jobs',
					idempotencyMode: 'advisory',
					idempotencyKey: 'messageId',
					mapPayload: (event: any) => ({ id: event.id }),
					mapParameter: (event: any) => ({ tenant: event.tenant }),
				},
			],
		} as any)

		await service.start()
		expect(eventBridge.stubs.registerSubscription.getCall(0).args[0].eventBridgeConfig).toMatchObject({
			durable: true,
			autoacknowledge: false,
		})
		await expect(
			service.executeSubscription(
				getCustomMessageMessageMock(
					'source.event',
					{
						id: 'payload-1',
						tenant: 'tenant-1',
					},
					{ id: 'custom-message-id', principalId: 'principalId', tenantId: 'tenantId' },
				),
				'eventToQueue:source.event:jobs',
			),
		).resolves.toBeUndefined()

		expect(queueBridge.stubs.enqueue.callCount).toBe(1)
		expect(queueBridge.stubs.enqueue.getCall(0).args[0]).toMatchObject({
			queueName: 'jobs',
			payload: { id: 'payload-1' },
			parameter: { tenant: 'tenant-1' },
			idempotencyKey: 'custom-message-id',
			headers: {
				'purista.principalId': 'principalId',
				'purista.tenantId': 'tenantId',
			},
		})
		await service.destroy()
	})

	it('keeps event-to-queue bindings compatible with in-memory event bridges', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock({
			capabilities: {
				durableSubscriptions: false,
				manualAckSupported: false,
			},
		})
		const queueBridge = getQueueBridgeMock()
		const queueDefinition = await new QueueDefinitionBuilder('jobs', 'jobs').getDefinition()
		const service = new Service({
			logger,
			eventBridge: eventBridge.mock,
			queueBridge: queueBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			streamDefinitionList: [],
			queueDefinitionList: [queueDefinition],
			queueWorkerDefinitionList: [],
			config: {},
			eventToQueueBindingList: [{ eventName: 'source.event', queueName: 'jobs', idempotencyMode: 'advisory' }],
		} as any)

		await service.start()

		expect(eventBridge.stubs.registerSubscription.getCall(0).args[0].eventBridgeConfig).toMatchObject({
			durable: false,
			autoacknowledge: true,
		})

		await service.destroy()
	})

	it('rejects strict event-to-queue idempotency when the queue bridge cannot enforce it', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock()
		const queueBridge = getQueueBridgeMock({ capabilities: { idempotencyEnforcement: false } })
		const queueDefinition = await new QueueDefinitionBuilder('jobs', 'jobs').getDefinition()
		const service = new Service({
			logger,
			eventBridge: eventBridge.mock,
			queueBridge: queueBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			streamDefinitionList: [],
			queueDefinitionList: [queueDefinition],
			queueWorkerDefinitionList: [],
			config: {},
			eventToQueueBindingList: [
				{
					eventName: 'source.event',
					queueName: 'jobs',
					idempotencyMode: 'strict',
					idempotencyKey: 'messageId',
				},
			],
		} as any)

		await expect(service.start()).rejects.toMatchObject({ errorCode: StatusCode.NotImplemented })
	})
})
