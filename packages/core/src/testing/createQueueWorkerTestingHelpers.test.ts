import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { createQueueWorkerContextMock } from './createQueueWorkerContextMock.js'
import { createQueueWorkerTestHarness } from './createQueueWorkerTestHarness.js'

describe('queue worker testing helpers', () => {
	it('creates a controllable queue worker context mock', async () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'WorkerService',
			serviceVersion: '1',
			serviceDescription: 'worker service',
		})

		const workerBuilder = serviceBuilder
			.getQueueWorkerBuilder('jobs', 'jobWorker')
			.setHandler(async function (context) {
				await context.job.complete({ status: 'done' })
				return { status: 'success' as const }
			})

		const mock = createQueueWorkerContextMock(workerBuilder, {
			queueName: 'jobs',
			payload: { id: '1' },
			parameter: {},
		})

		const definition = await workerBuilder.getDefinition()
		await definition.handler(mock.context as never, mock.message as never)

		expect(mock.stubs.job.complete.calledOnce).toBe(true)
		expect(mock.stubs.job.complete.firstCall.args[0]).toStrictEqual({ status: 'done' })
	})

	it('creates declared capability stubs for direct queue worker handler tests', async () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'WorkerService',
			serviceVersion: '1',
			serviceDescription: 'worker service',
		})

		const payloadSchema = z.object({ id: z.string() })
		const parameterSchema = z.object({ tenantId: z.string() })
		const outputSchema = z.object({ status: z.literal('ok') })

		const workerBuilder = serviceBuilder
			.getQueueWorkerBuilder('jobs', 'jobWorker')
			.canInvoke('TicketService', '1', 'loadTicket', outputSchema, payloadSchema, parameterSchema)
			.canEnqueue('auditQueue', payloadSchema, parameterSchema)
			.canEmit('worker.done', z.object({ jobId: z.string() }))
			.setHandler(async function (context) {
				const payload = context.message.payload as { id: string }
				const parameter = context.message.parameter as { tenantId: string }
				const ticket = await context.service.TicketService['1'].loadTicket(
					{ id: payload.id },
					{ tenantId: parameter.tenantId },
				)
				await context.queue.enqueue.auditQueue({ id: payload.id }, { tenantId: parameter.tenantId })
				await context.emit('worker.done', { jobId: context.message.id })

				expectTypeOf(ticket.status).toEqualTypeOf<'ok'>()

				return { status: 'success' as const }
			})

		const mock = createQueueWorkerContextMock(workerBuilder, {
			queueName: 'jobs',
			payload: { id: '42' },
			parameter: { tenantId: 'tenant-1' },
		})
		const service = mock.stubs.service as any

		service.TicketService['1'].loadTicket.resolves({ status: 'ok' })

		const definition = await workerBuilder.getDefinition()
		await definition.handler(mock.context as never, mock.message as never)

		expect(service.TicketService['1'].loadTicket.calledOnce).toBe(true)
		expect(mock.stubs.enqueue.calledOnce).toBe(true)
		expect((mock.stubs.emit as any)['worker.done'].calledOnce).toBe(true)
	})

	it('executes one queue worker cycle through the runtime harness', async () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'HarnessWorkerService',
			serviceVersion: '1',
			serviceDescription: 'worker harness service',
		})

		const queueBuilder = serviceBuilder
			.getQueueBuilder('jobs', 'job queue')
			.addPayloadSchema(z.object({ id: z.string() }))
			.addParameterSchema(z.object({}))

		const workerBuilder = serviceBuilder
			.getQueueWorkerBuilder('jobs', 'jobWorker')
			.setHandler(async function (context) {
				await context.job.complete({ processed: '42' })
				return { status: 'success' as const }
			})

		serviceBuilder.addQueueDefinition(queueBuilder.getDefinition())
		serviceBuilder.addQueueWorkerDefinition(workerBuilder.getDefinition())

		const harness = await createQueueWorkerTestHarness(serviceBuilder, workerBuilder)

		try {
			const result = await harness.run({
				id: 'job-1',
				queueName: 'jobs',
				payload: { id: '42' },
				parameter: {},
				headers: {},
				createdAt: Date.now(),
				attempt: 1,
				maxAttempts: 3,
				leaseExpiresAt: Date.now() + 60_000,
				leaseTtlMs: 60_000,
				traceId: 'trace-1',
				correlationId: 'corr-1',
			})

			expect(result.ackCalls).toHaveLength(1)
			expect(result.deadLetterCalls).toHaveLength(0)
			expect(result.nackCalls).toHaveLength(0)
		} finally {
			await harness.destroy()
		}
	})

	it('passes declared worker capabilities into the runtime queue worker context', async () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'HarnessWorkerService',
			serviceVersion: '1',
			serviceDescription: 'worker harness service',
		})

		const payloadSchema = z.object({ id: z.string() })
		const parameterSchema = z.object({ tenantId: z.string() })
		const outputSchema = z.object({ status: z.literal('ok') })

		const queueBuilder = serviceBuilder
			.getQueueBuilder('jobs', 'job queue')
			.addPayloadSchema(payloadSchema)
			.addParameterSchema(parameterSchema)
		const auditQueueBuilder = serviceBuilder
			.getQueueBuilder('auditQueue', 'audit queue')
			.addPayloadSchema(payloadSchema)
			.addParameterSchema(parameterSchema)

		const workerBuilder = serviceBuilder
			.getQueueWorkerBuilder('jobs', 'jobWorker')
			.canEnqueue('auditQueue', payloadSchema, parameterSchema)
			.canInvoke('Knowledge', '1', 'triageTicket', outputSchema, payloadSchema, parameterSchema)
			.setHandler(async function (context) {
				const payload = context.message.payload as { id: string }
				const parameter = context.message.parameter as { tenantId: string }
				await context.queue.enqueue.auditQueue({ id: payload.id }, { tenantId: parameter.tenantId })
				const result = await context.service.Knowledge['1'].triageTicket(
					{ id: payload.id },
					{ tenantId: parameter.tenantId },
				)
				expect(result.status).toBe('ok')
				return { status: 'success' as const }
			})

		serviceBuilder.addQueueDefinition(queueBuilder.getDefinition(), auditQueueBuilder.getDefinition())
		serviceBuilder.addQueueWorkerDefinition(workerBuilder.getDefinition())

		const harness = await createQueueWorkerTestHarness(serviceBuilder, workerBuilder)
		harness.stubs.eventBridge?.invoke.resolves({ status: 'ok' })

		try {
			await harness.run({
				id: 'job-capability',
				queueName: 'jobs',
				payload: { id: '42' },
				parameter: { tenantId: 'tenant-1' },
				headers: {},
				createdAt: Date.now(),
				attempt: 1,
				maxAttempts: 3,
				leaseExpiresAt: Date.now() + 60_000,
				leaseTtlMs: 60_000,
				traceId: 'trace-capability',
				correlationId: 'corr-capability',
			})

			expect(harness.stubs.queueBridge?.enqueue.calledOnce).toBe(true)
			expect(harness.stubs.eventBridge?.invoke.calledOnce).toBe(true)
		} finally {
			await harness.destroy()
		}
	})

	it('routes thrown worker errors through the queue retry lifecycle', async () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'HarnessWorkerService',
			serviceVersion: '1',
			serviceDescription: 'worker harness service',
		})

		const queueBuilder = serviceBuilder
			.getQueueBuilder('jobs', 'job queue')
			.addPayloadSchema(z.object({ id: z.string() }))
			.addParameterSchema(z.object({}))

		const workerBuilder = serviceBuilder.getQueueWorkerBuilder('jobs', 'jobWorker').setHandler(async function () {
			throw new Error('boom')
		})

		serviceBuilder.addQueueDefinition(queueBuilder.getDefinition())
		serviceBuilder.addQueueWorkerDefinition(workerBuilder.getDefinition())

		const harness = await createQueueWorkerTestHarness(serviceBuilder, workerBuilder)

		try {
			const result = await harness.run({
				id: 'job-2',
				queueName: 'jobs',
				payload: { id: '42' },
				parameter: {},
				headers: {},
				createdAt: Date.now(),
				attempt: 1,
				maxAttempts: 3,
				leaseExpiresAt: Date.now() + 60_000,
				leaseTtlMs: 60_000,
				traceId: 'trace-2',
				correlationId: 'corr-2',
			})

			expect(result.ackCalls).toHaveLength(0)
			expect(result.deadLetterCalls).toHaveLength(0)
			expect(result.nackCalls).toHaveLength(1)
			expect(result.nackCalls[0]?.args[2]).toMatchObject({
				reason: 'boom',
			})
		} finally {
			await harness.destroy()
		}
	})
})
