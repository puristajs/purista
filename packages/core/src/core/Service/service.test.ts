import { stub } from 'sinon'
import { vi } from 'vitest'
import { z } from 'zod/v4'
import { getEventBridgeMock, getLoggerMock } from '../../mocks/index.js'
import { getCustomMessageMessageMock } from '../../mocks/messages/getCustomMessage.mock.js'
import { QueueDefinitionBuilder } from '../../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import { QueueWorkerBuilder } from '../../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import { SubscriptionDefinitionBuilder } from '../../SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import type { QueueBridge } from '../QueueBridge/types/QueueBridge.js'
import type { ServiceInfoType } from '../types/index.js'
import { Service } from './Service.impl.js'

const getQueueBridgeMock = () => {
	const enqueue = stub().resolves({ jobId: 'job', queueName: 'queue' })
	const leaseNext = stub().resolves(undefined)
	const extendLease = stub().resolves()
	const ack = stub().resolves()
	const nack = stub().resolves()
	const moveToDeadLetter = stub().resolves()
	const metrics = stub().resolves({ pending: 0, inflight: 0, deadLetter: 0, retries: 0 })
	const start = stub().resolves()
	const destroy = stub().resolves()
	const isReady = stub().resolves(true)
	const isHealthy = stub().resolves(true)

	const mock: QueueBridge = {
		name: 'QueueBridgeMock',
		instanceId: 'queue-mock',
		capabilities: {
			delayedDelivery: true,
			fifoOrdering: true,
			partitions: false,
			priorities: false,
			deadLetterNative: false,
			exactlyOnce: false,
			maxBatchSize: 1,
			defaultDeadLetterPrefix: '',
			defaultDeadLetterSuffix: '.dead-letter',
			deadLetterInspectable: true,
		},
		start,
		destroy,
		isReady,
		isHealthy,
		enqueue,
		leaseNext,
		extendLease,
		ack,
		nack,
		moveToDeadLetter,
		metrics,
	}

	return {
		mock,
		stubs: {
			enqueue,
			leaseNext,
			extendLease,
			ack,
			nack,
			moveToDeadLetter,
			metrics,
			start,
			destroy,
			isReady,
			isHealthy,
		},
	}
}

describe('Service', () => {
	const serviceInfo: ServiceInfoType = {
		serviceName: 'TestService',
		serviceVersion: '1',
		serviceDescription: 'A service for unit tests',
	}

	it('creates a new instance', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock

		const service = new Service({
			logger,
			eventBridge,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			config: {},
		})

		await expect(service.start()).resolves.toBeUndefined()

		await expect(service.destroy()).resolves.toBeUndefined()
	})

	it('validates invokes in subscription after-guard hooks', async () => {
		const logger = getLoggerMock()
		const eventBridge = getEventBridgeMock()
		eventBridge.stubs.invoke.resolves({ ok: true })

		const subscriptionBuilder = new SubscriptionDefinitionBuilder('validateInvoke', 'validate invoke definitions')
			.canInvoke(
				'OtherService',
				'1',
				'otherCommand',
				z.object({ ok: z.boolean() }),
				z.object({ requiredField: z.string() }),
				z.object({}),
			)
			.setAfterGuardHooks({
				invoke: async function (context) {
					// @ts-expect-error intentionally invalid payload shape to verify runtime validation
					await context.service.OtherService[1].otherCommand({ invalid: true }, {})
				},
			})
			.setSubscriptionFunction(async function () {
				return { done: true }
			})

		const subscriptionDefinition = await subscriptionBuilder.getDefinition()
		const service = new Service({
			logger: logger.mock,
			eventBridge: eventBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [subscriptionDefinition],
			config: {},
		})

		await service.registerSubscription(subscriptionDefinition)

		const message = getCustomMessageMessageMock('custom-event', { test: true })

		await expect(service.executeSubscription(message, 'validateInvoke')).rejects.toBeInstanceOf(UnhandledError)
		expect(eventBridge.stubs.invoke.callCount).toBe(0)
	})

	it('prevents enqueuing queues not declared via canEnqueue for a handler', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock
		const queueBridge = getQueueBridgeMock()
		const queueDefinition = await new QueueDefinitionBuilder('orders', 'orders queue').getDefinition()

		const service = new Service({
			logger,
			eventBridge,
			queueBridge: queueBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			streamDefinitionList: [],
			queueDefinitionList: [queueDefinition],
			config: {},
		})

		await expect(
			(service as any).enqueueQueue('orders', { foo: 'bar' }, undefined, { allowed: {} }),
		).rejects.toBeInstanceOf(UnhandledError)
		expect(queueBridge.stubs.enqueue.callCount).toBe(0)
	})

	it('prevents enqueuing when no canEnqueue entries exist', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock
		const queueBridge = getQueueBridgeMock()
		const queueDefinition = await new QueueDefinitionBuilder('orders', 'orders queue').getDefinition()

		const service = new Service({
			logger,
			eventBridge,
			queueBridge: queueBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			streamDefinitionList: [],
			queueDefinitionList: [queueDefinition],
			config: {},
		})

		await expect((service as any).enqueueQueue('orders', { foo: 'bar' }, undefined, {})).rejects.toBeInstanceOf(
			UnhandledError,
		)
		expect(queueBridge.stubs.enqueue.callCount).toBe(0)
	})

	it('throws when attempting to enqueue an unknown queue', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock
		const queueBridge = getQueueBridgeMock()

		const service = new Service({
			logger,
			eventBridge,
			queueBridge: queueBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			streamDefinitionList: [],
			queueDefinitionList: [],
			config: {},
		})

		await expect((service as any).enqueueQueue('missing', { foo: 'bar' }, undefined, undefined)).rejects.toBeInstanceOf(
			UnhandledError,
		)
		expect(queueBridge.stubs.enqueue.callCount).toBe(0)
	})

	it('uses queue definition schemas and lifecycle defaults when enqueuing', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock
		const queueBridge = getQueueBridgeMock()

		const queueDefinition = await new QueueDefinitionBuilder('orders', 'orders queue')
			.addPayloadSchema(z.object({ id: z.string() }))
			.setLifecycleConfig({
				visibilityTimeoutMs: 45_000,
				maxLeaseExtensions: 3,
				heartbeatIntervalMs: 5_000,
				retryWindowMs: 300_000,
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
			config: {},
		})

		await expect((service as any).enqueueQueue('orders', { id: 123 }, undefined, undefined)).rejects.toBeInstanceOf(
			UnhandledError,
		)

		queueBridge.stubs.enqueue.resetHistory()

		await expect((service as any).enqueueQueue('orders', { id: 'abc' }, undefined, undefined)).resolves.toMatchObject({
			queueName: 'queue',
		})

		expect(queueBridge.stubs.enqueue.callCount).toBe(1)
		const callArgs = queueBridge.stubs.enqueue.getCall(0).args[0]
		expect(callArgs.leaseTtlMs).toBe(queueDefinition.lifecycle?.visibilityTimeoutMs)
	})

	it('runs transformBeforeEnqueue hook prior to persisting the job', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock
		const queueBridge = getQueueBridgeMock()

		let hookCalled = false
		let hookQueueNamespace: unknown

		const queueDefinition = await new QueueDefinitionBuilder('orders', 'orders queue')
			.addPayloadSchema(z.object({ id: z.string() }))
			.setBeforeEnqueueTransform(async function (context, payload) {
				expect(this).toBeInstanceOf(Service)
				const typedPayload = payload as Readonly<{ id: string }>
				expect(typedPayload.id).toBe('abc')
				hookCalled = true
				hookQueueNamespace = context.queue
				return { payload: { id: typedPayload.id.toUpperCase() } }
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
			config: {},
		})

		await (service as any).enqueueQueue('orders', { id: 'abc' }, undefined, undefined)

		expect(hookCalled).toBe(true)
		expect(typeof (hookQueueNamespace as { enqueue?: unknown })?.enqueue).toBe('function')
		const callArgs = queueBridge.stubs.enqueue.getCall(0).args[0]
		expect((callArgs.payload as { id: string }).id).toBe('ABC')
	})

	it('applies transformBeforeExecute hook before invoking the worker handler', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock
		const queueBridge = getQueueBridgeMock()

		let handlerPayload: unknown

		const queueDefinition = await new QueueDefinitionBuilder('orders', 'orders queue')
			.setBeforeExecuteTransform(async function (_context, payload) {
				expect(this).toBeInstanceOf(Service)
				return { payload: { ...(payload as Record<string, unknown>), processed: true } }
			})
			.getDefinition()

		const queueWorker = await new QueueWorkerBuilder('orders', 'orders-worker')
			.setHandler(async function (context, message) {
				handlerPayload = message.payload
				await context.job.complete()
				return { status: 'success' }
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
			queueWorkerDefinitionList: [queueWorker],
			config: {},
		})

		queueBridge.stubs.leaseNext.callsFake(async () => {
			if ((service as any).queueWorkersShouldStop) {
				return undefined
			}
			;(service as any).queueWorkersShouldStop = true
			return {
				id: 'job-1',
				queueName: 'orders',
				message: {
					id: 'message-1',
					queueName: 'orders',
					payload: { foo: 'bar' },
					headers: {},
					createdAt: Date.now(),
					attempt: 0,
					maxAttempts: 5,
					leaseExpiresAt: Date.now() + 30_000,
					leaseTtlMs: 30_000,
				},
				leaseId: 'lease-1',
				leasedAt: Date.now(),
				leaseExpiresAt: Date.now() + 30_000,
			}
		})

		await (service as any).runQueueWorker(queueWorker)

		expect(handlerPayload).toEqual({ foo: 'bar', processed: true })
		expect(queueBridge.stubs.ack.callCount).toBe(1)
	})

	it('executes queue worker guard hooks around handler execution', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock
		const queueBridge = getQueueBridgeMock()
		const beforeHook = vi.fn()
		const afterHook = vi.fn()

		const queueDefinition = await new QueueDefinitionBuilder('orders', 'orders queue').getDefinition()

		const queueWorker = await new QueueWorkerBuilder('orders', 'orders-worker')
			.setBeforeGuardHooks({
				auth: async function (_context, message) {
					beforeHook(message.id)
				},
			})
			.setAfterGuardHooks({
				audit: async function (_context, result) {
					afterHook(result?.status ?? 'void')
				},
			})
			.setHandler(async function (context) {
				await context.job.complete()
				return { status: 'success' }
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
			queueWorkerDefinitionList: [queueWorker],
			config: {},
		})

		queueBridge.stubs.leaseNext.callsFake(async () => {
			if ((service as any).queueWorkersShouldStop) {
				return undefined
			}
			;(service as any).queueWorkersShouldStop = true
			return {
				id: 'job-guard',
				queueName: 'orders',
				message: {
					id: 'message-guard',
					queueName: 'orders',
					payload: { foo: 'bar' },
					headers: {},
					createdAt: Date.now(),
					attempt: 0,
					maxAttempts: 3,
					leaseExpiresAt: Date.now() + 30_000,
					leaseTtlMs: 30_000,
				},
				leaseId: 'lease-guard',
				leasedAt: Date.now(),
				leaseExpiresAt: Date.now() + 30_000,
			}
		})

		await (service as any).runQueueWorker(queueWorker)

		expect(beforeHook).toHaveBeenCalledWith('message-guard')
		expect(afterHook).toHaveBeenCalledWith('success')
	})

	it('auto extends leases according to lifecycle heartbeat defaults', async () => {
		vi.useFakeTimers()
		try {
			const logger = getLoggerMock().mock
			const eventBridge = getEventBridgeMock().mock
			const queueBridge = getQueueBridgeMock()

			const queueDefinition = await new QueueDefinitionBuilder('orders', 'orders queue')
				.setLifecycleConfig({
					visibilityTimeoutMs: 1_000,
					maxLeaseExtensions: 2,
					heartbeatIntervalMs: 10,
					retryWindowMs: 60_000,
				})
				.getDefinition()

			const queueWorker = await new QueueWorkerBuilder('orders', 'orders-worker')
				.setHandler(async function (context) {
					await new Promise(resolve => {
						setTimeout(resolve, 50)
					})
					await context.job.complete()
					return { status: 'success' }
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
				queueWorkerDefinitionList: [queueWorker],
				config: {},
			})

			queueBridge.stubs.leaseNext.callsFake(async () => {
				if ((service as any).queueWorkersShouldStop) {
					return undefined
				}
				;(service as any).queueWorkersShouldStop = true
				return {
					id: 'job-2',
					queueName: 'orders',
					message: {
						id: 'message-2',
						queueName: 'orders',
						payload: { foo: 'bar' },
						headers: {},
						createdAt: Date.now(),
						attempt: 0,
						maxAttempts: 5,
						leaseExpiresAt: Date.now() + 30_000,
						leaseTtlMs: 30_000,
					},
					leaseId: 'lease-2',
					leasedAt: Date.now(),
					leaseExpiresAt: Date.now() + 30_000,
				}
			})

			const runPromise = (service as any).runQueueWorker(queueWorker)
			await vi.advanceTimersByTimeAsync(100)
			await runPromise

			expect(queueBridge.stubs.extendLease.callCount).toBeGreaterThan(0)
		} finally {
			vi.useRealTimers()
		}
	})

	it('nacks the queue message when the handler throws before settlement', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock
		const queueBridge = getQueueBridgeMock()

		const queueDefinition = await new QueueDefinitionBuilder('orders', 'orders queue').getDefinition()

		const queueWorker = await new QueueWorkerBuilder('orders', 'orders-worker')
			.setHandler(async function () {
				throw new Error('boom')
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
			queueWorkerDefinitionList: [queueWorker],
			config: {},
		})

		queueBridge.stubs.leaseNext.callsFake(async () => {
			if ((service as any).queueWorkersShouldStop) {
				return undefined
			}
			;(service as any).queueWorkersShouldStop = true
			return {
				id: 'job-3',
				queueName: 'orders',
				message: {
					id: 'message-3',
					queueName: 'orders',
					payload: { foo: 'bar' },
					headers: {},
					createdAt: Date.now(),
					attempt: 0,
					maxAttempts: 5,
					leaseExpiresAt: Date.now() + 30_000,
					leaseTtlMs: 30_000,
				},
				leaseId: 'lease-3',
				leasedAt: Date.now(),
				leaseExpiresAt: Date.now() + 30_000,
			}
		})

		await (service as any).runQueueWorker(queueWorker)

		expect(queueBridge.stubs.nack.callCount).toBeGreaterThan(0)
	})

	it('uses default dead-letter queue name when fatal failure happens', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock
		const queueBridge = getQueueBridgeMock()

		const queueDefinition = await new QueueDefinitionBuilder('orders', 'orders queue').getDefinition()

		const queueWorker = await new QueueWorkerBuilder('orders', 'orders-worker')
			.setHandler(async function () {
				return { status: 'fail', reason: 'boom', fatal: true }
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
			queueWorkerDefinitionList: [queueWorker],
			config: {},
		})

		queueBridge.stubs.leaseNext.callsFake(async () => {
			if ((service as any).queueWorkersShouldStop) {
				return undefined
			}
			;(service as any).queueWorkersShouldStop = true
			return {
				id: 'job-4',
				queueName: 'orders',
				message: {
					id: 'message-4',
					queueName: 'orders',
					payload: { foo: 'bar' },
					headers: {},
					createdAt: Date.now(),
					attempt: 0,
					maxAttempts: 5,
					leaseExpiresAt: Date.now() + 30_000,
					leaseTtlMs: 30_000,
				},
				leaseId: 'lease-4',
				leasedAt: Date.now(),
				leaseExpiresAt: Date.now() + 30_000,
			}
		})

		await (service as any).runQueueWorker(queueWorker)

		expect(queueBridge.stubs.moveToDeadLetter.callCount).toBe(1)
		const callArgs = queueBridge.stubs.moveToDeadLetter.getCall(0).args
		expect(callArgs[0]).toBe('orders.dead-letter')
	})

	it('respects custom dead-letter queue names from definition', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock
		const queueBridge = getQueueBridgeMock()

		const queueDefinition = await new QueueDefinitionBuilder('orders', 'orders queue')
			.setDeadLetterOptions({ queueName: 'custom-dlq' })
			.getDefinition()

		const queueWorker = await new QueueWorkerBuilder('orders', 'orders-worker')
			.setHandler(async function () {
				return { status: 'fail', reason: 'boom', fatal: true }
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
			queueWorkerDefinitionList: [queueWorker],
			config: {},
		})

		queueBridge.stubs.leaseNext.callsFake(async () => {
			if ((service as any).queueWorkersShouldStop) {
				return undefined
			}
			;(service as any).queueWorkersShouldStop = true
			return {
				id: 'job-5',
				queueName: 'orders',
				message: {
					id: 'message-5',
					queueName: 'orders',
					payload: { foo: 'bar' },
					headers: {},
					createdAt: Date.now(),
					attempt: 0,
					maxAttempts: 5,
					leaseExpiresAt: Date.now() + 30_000,
					leaseTtlMs: 30_000,
				},
				leaseId: 'lease-5',
				leasedAt: Date.now(),
				leaseExpiresAt: Date.now() + 30_000,
			}
		})

		await (service as any).runQueueWorker(queueWorker)

		expect(queueBridge.stubs.moveToDeadLetter.callCount).toBe(1)
		const callArgs = queueBridge.stubs.moveToDeadLetter.getCall(0).args
		expect(callArgs[0]).toBe('custom-dlq')
	})

	it('exposes service health aggregated from queue metrics', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock
		const queueBridge = getQueueBridgeMock()

		const queueDefinition = await new QueueDefinitionBuilder('orders', 'orders queue').getDefinition()
		const queueWorker = await new QueueWorkerBuilder('orders', 'orders-worker')
			.setHandler(async function () {
				return { status: 'success' }
			})
			.getDefinition()

		queueBridge.stubs.metrics.callsFake(async () => ({
			pending: 0,
			inflight: 0,
			deadLetter: 2,
			retries: 1,
		}))

		const service = new Service({
			logger,
			eventBridge,
			queueBridge: queueBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			streamDefinitionList: [],
			queueDefinitionList: [queueDefinition],
			queueWorkerDefinitionList: [queueWorker],
			config: {},
		})

		const health = await service.getServiceHealth()

		expect(health.status).toBe('warn')
		expect(health.queues).toHaveLength(1)
		expect(health.queues[0].status).toBe('warn')
		expect(queueBridge.stubs.metrics.callCount).toBe(1)
	})

	it('marks service health as error when queue metrics cannot be fetched', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock
		const queueBridge = getQueueBridgeMock()

		const queueDefinition = await new QueueDefinitionBuilder('orders', 'orders queue').getDefinition()

		queueBridge.stubs.metrics.rejects(new Error('boom'))

		const service = new Service({
			logger,
			eventBridge,
			queueBridge: queueBridge.mock,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			streamDefinitionList: [],
			queueDefinitionList: [queueDefinition],
			queueWorkerDefinitionList: [],
			config: {},
		})

		const health = await service.getServiceHealth()

		expect(health.status).toBe('error')
		expect(health.queues[0].status).toBe('error')
	})
})
