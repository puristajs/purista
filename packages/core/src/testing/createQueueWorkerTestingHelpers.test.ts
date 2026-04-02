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
