import { describe, expect, it, vi } from 'vitest'

import { StatusCode } from '../types/StatusCode.enum.js'
import { createStateStoreRetentionView } from './createStateStoreRetentionView.impl.js'
import type { StateStore } from './types/StateStore.js'

const createStore = (atomicExpiry: boolean): StateStore & { setState: ReturnType<typeof vi.fn> } => ({
	name: 'test-store',
	capabilities: { retention: { atomicExpiry } },
	getState: vi.fn(),
	removeState: vi.fn(),
	setState: vi.fn().mockResolvedValue(undefined),
	destroy: vi.fn().mockResolvedValue(undefined),
})

describe('createStateStoreRetentionView', () => {
	it('resolves write retention before service-view and store-view defaults without mutating the source store', async () => {
		const store = createStore(true)
		const storeView = createStateStoreRetentionView(store, {
			default: { mode: 'expire', ttlMs: 30_000 },
		})
		const serviceView = createStateStoreRetentionView(storeView, {
			default: { mode: 'expire', ttlMs: 10_000 },
		})

		await serviceView.setState('service-default', 'value')
		await serviceView.setState('write-override', 'value', { retention: { mode: 'expire', ttlMs: 1_000 } })

		expect(store.setState).toHaveBeenNthCalledWith(1, 'service-default', 'value', {
			retention: { mode: 'expire', ttlMs: 10_000 },
		})
		expect(store.setState).toHaveBeenNthCalledWith(2, 'write-override', 'value', {
			retention: { mode: 'expire', ttlMs: 1_000 },
		})
		expect(storeView).not.toBe(store)
	})

	it('uses a store-view default when the service has no local policy', async () => {
		const store = createStore(true)
		const storeView = createStateStoreRetentionView(store, {
			default: { mode: 'expire', ttlMs: 30_000 },
		})
		const serviceView = createStateStoreRetentionView(storeView)

		await serviceView.setState('store-default', 'value')

		expect(store.setState).toHaveBeenCalledWith('store-default', 'value', {
			retention: { mode: 'expire', ttlMs: 30_000 },
		})
	})

	it('rejects finite retention for custom stores that do not declare atomic expiry', async () => {
		const store = createStore(false)
		const serviceView = createStateStoreRetentionView(store)

		await expect(
			serviceView.setState('temporary', 'value', { retention: { mode: 'expire', ttlMs: 1_000 } }),
		).rejects.toMatchObject({
			errorCode: StatusCode.NotImplemented,
			message: 'state store "test-store" does not support atomic expiry',
		})
		expect(store.setState).not.toHaveBeenCalled()
	})
})
