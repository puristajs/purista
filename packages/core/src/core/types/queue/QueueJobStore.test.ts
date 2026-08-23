import { describe, expect, it, vi } from 'vitest'

import type { StateStore } from '../../StateStore/types/StateStore.js'
import { StatusCode } from '../../types/StatusCode.enum.js'
import { createStateStoreQueueJobStore } from './QueueJobStore.js'

describe('createStateStoreQueueJobStore', () => {
	it('forwards a queue result TTL as the shared state write retention option', async () => {
		const setState = vi.fn().mockResolvedValue(undefined)
		const stateStore: StateStore = {
			name: 'test-store',
			capabilities: { retention: { atomicExpiry: true } },
			getState: vi.fn(),
			removeState: vi.fn(),
			setState,
			destroy: vi.fn(),
		}
		const jobStore = createStateStoreQueueJobStore(stateStore, 'queue-results')

		await jobStore.set(
			{
				jobId: 'job-1',
				queueName: 'orders',
				status: 'success',
				attempt: 1,
				updatedAt: 1,
			},
			1_000,
		)

		expect(setState).toHaveBeenCalledWith('queue-results:job-1', expect.objectContaining({ jobId: 'job-1' }), {
			retention: { mode: 'expire', ttlMs: 1_000 },
		})
	})

	it('uses the permanent default when no queue result TTL is configured', async () => {
		const setState = vi.fn().mockResolvedValue(undefined)
		const stateStore: StateStore = {
			name: 'test-store',
			getState: vi.fn(),
			removeState: vi.fn(),
			setState,
			destroy: vi.fn(),
		}
		const jobStore = createStateStoreQueueJobStore(stateStore)

		await jobStore.set({ jobId: 'job-1', queueName: 'orders', status: 'success', attempt: 1, updatedAt: 1 })

		expect(setState).toHaveBeenCalledWith('purista:queue-job:job-1', expect.any(Object), undefined)
	})

	it('rejects a queue result TTL when a custom state store has no atomic-expiry capability', async () => {
		const setState = vi.fn().mockResolvedValue(undefined)
		const stateStore: StateStore = {
			name: 'custom-store',
			getState: vi.fn(),
			removeState: vi.fn(),
			setState,
			destroy: vi.fn(),
		}
		const jobStore = createStateStoreQueueJobStore(stateStore)

		await expect(
			jobStore.set({ jobId: 'job-1', queueName: 'orders', status: 'success', attempt: 1, updatedAt: 1 }, 1_000),
		).rejects.toMatchObject({ errorCode: StatusCode.NotImplemented })
		expect(setState).not.toHaveBeenCalled()
	})
})
