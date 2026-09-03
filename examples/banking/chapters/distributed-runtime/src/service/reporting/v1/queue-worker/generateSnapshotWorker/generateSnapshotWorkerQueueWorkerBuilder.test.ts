import { createQueueWorkerTestHarness } from '@purista/core'
import { expect, test, vi } from 'vitest'
import { reportingV1Service } from '../../reportingV1Service.js'
import { generateSnapshotWorkerQueueWorkerBuilder } from './generateSnapshotWorkerQueueWorkerBuilder.js'

test('stores the typed snapshot result and acknowledges the lease', async () => {
	const transactionId = '3bd00f72-8db0-4f39-875d-fd5e251a7f32'
	const set = vi.fn().mockResolvedValue(undefined)
	const harness = await createQueueWorkerTestHarness(
		reportingV1Service,
		generateSnapshotWorkerQueueWorkerBuilder,
		{ queueJobStore: { get: vi.fn(), set } },
	)
	try {
		const result = await harness.run({
			id: 'job-1', queueName: 'generateSnapshot',
			payload: { transactionId }, parameter: {}, headers: {},
			createdAt: Date.now(), attempt: 1, maxAttempts: 3,
			leaseExpiresAt: Date.now() + 60_000, leaseTtlMs: 60_000,
		})
		expect(result.ackCalls).toHaveLength(1)
		expect(set).toHaveBeenCalledWith(expect.objectContaining({
			status: 'success',
			result: expect.objectContaining({ transactionId, result: 'snapshot-ready' }),
		}), 15 * 60 * 1000)
	} finally {
		await harness.destroy()
	}
})
