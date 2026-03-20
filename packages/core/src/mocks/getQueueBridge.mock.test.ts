import { describe, expect, it } from 'vitest'

import { getQueueBridgeMock } from './getQueueBridge.mock.js'

describe('getQueueBridgeMock', () => {
	it('provides a queue bridge mock with resolved defaults', async () => {
		const queueBridge = getQueueBridgeMock()

		await expect(queueBridge.mock.start()).resolves.toBeUndefined()
		await expect(queueBridge.mock.isReady()).resolves.toBe(true)
		await expect(queueBridge.mock.isHealthy()).resolves.toBe(true)
		await expect(queueBridge.mock.enqueue({ queueName: 'jobs', payload: { ok: true } })).resolves.toEqual({
			jobId: 'job',
			queueName: 'queue',
		})
		await expect(queueBridge.mock.metrics('jobs')).resolves.toEqual({
			pending: 0,
			inflight: 0,
			deadLetter: 0,
			retries: 0,
		})
	})
})
