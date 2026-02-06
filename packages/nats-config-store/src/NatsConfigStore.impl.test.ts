import type { KV, NatsConnection } from 'nats'
import * as nats from 'nats'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NatsConfigStore } from './NatsConfigStore.impl.js'

describe('NatsConfigStore', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('reconnects when cached kv exists but connection is closed', async () => {
		const store = new NatsConfigStore()
		const staleKv = {} as KV
		const freshKv = {} as KV
		const kv = vi.fn().mockResolvedValue(freshKv)
		const connectSpy = vi.spyOn(nats, 'connect').mockResolvedValue({
			info: { jetstream: true },
			jetstream: () => ({ views: { kv } }),
			isClosed: () => false,
			isDraining: () => false,
		} as unknown as NatsConnection)

		store.kv = staleKv
		store.connection = {
			isClosed: () => true,
			isDraining: () => false,
		} as NatsConnection

		const result = await store.getStore()

		expect(connectSpy).toHaveBeenCalledTimes(1)
		expect(result).toBe(freshKv)
		expect(store.kv).toBe(freshKv)
	})

	it('clears cached handles on destroy', async () => {
		const drain = vi.fn().mockResolvedValue(undefined)
		const close = vi.fn().mockResolvedValue(undefined)
		const store = new NatsConfigStore()
		store.kv = {} as KV
		store.connection = { drain, close } as unknown as NatsConnection

		await store.destroy()

		expect(drain).toHaveBeenCalledTimes(1)
		expect(close).toHaveBeenCalledTimes(1)
		expect(store.kv).toBeUndefined()
		expect(store.connection).toBeUndefined()
	})
})
