import { assertSchedulerProviderContract, type SchedulerOccurrence } from '@purista/core/adapter'

import { RedisSchedulerProvider } from './RedisSchedulerProvider.impl.js'
import type { RedisSchedulerClient } from './types.js'

class MemoryRedisClient implements RedisSchedulerClient {
	private readonly values = new Map<string, string>()
	public isOpen = false

	async connect(): Promise<void> {
		this.isOpen = true
	}

	async disconnect(): Promise<void> {
		this.isOpen = false
	}

	async get(key: string): Promise<string | null> {
		return this.values.get(key) ?? null
	}

	async set(key: string, value: string, _options: { NX: true; PX: number }): Promise<string | null> {
		if (this.values.has(key)) {
			return null
		}
		this.values.set(key, value)
		return 'OK'
	}

	async eval(_script: string, options: { keys: string[]; arguments: string[] }): Promise<unknown> {
		const [claimKey, completedKey] = options.keys
		const [claimId, scheduledAt] = options.arguments
		if (this.values.get(claimKey) !== claimId) {
			return 0
		}
		this.values.delete(claimKey)
		if (completedKey) {
			const completedAt = this.values.get(completedKey)
			if (!completedAt || (scheduledAt && completedAt < scheduledAt)) {
				this.values.set(completedKey, scheduledAt ?? '1970-01-01T00:00:00.000Z')
			}
		}
		return 1
	}

	expire(key: string): void {
		this.values.delete(key)
	}
}

const occurrence: SchedulerOccurrence = {
	scheduleKey: 'billing/1/monthly-cycle',
	occurrenceId: 'monthly-cycle:2026-08-21T00:00:00.000Z',
	scheduledAt: '2026-08-21T00:00:00.000Z',
}

describe('RedisSchedulerProvider', () => {
	it('satisfies the shared durable and distributed provider contract', async () => {
		const client = new MemoryRedisClient()
		await assertSchedulerProviderContract({
			createProvider: () => new RedisSchedulerProvider({ client }),
			createReplica: () => new RedisSchedulerProvider({ client }),
		})
	})

	it('allows exactly one active claim across scheduler replicas and retains completion', async () => {
		const client = new MemoryRedisClient()
		const first = new RedisSchedulerProvider({ client })
		const second = new RedisSchedulerProvider({ client })
		await first.start()
		await second.start()

		const claim = await first.claimOccurrence(occurrence)
		if (!claim) {
			throw new Error('Expected the first provider to claim the occurrence')
		}
		expect(await second.claimOccurrence(occurrence)).toBeUndefined()

		await first.completeOccurrence(claim)
		expect(await second.claimOccurrence(occurrence)).toBeUndefined()
		expect(first.capabilities).toMatchObject({
			durableOccurrenceState: true,
			distributedOccurrenceClaims: true,
			idempotentPublication: false,
		})
	})

	it('allows failover after a lease expires and rejects stale completion tokens', async () => {
		const client = new MemoryRedisClient()
		const first = new RedisSchedulerProvider({ client })
		const second = new RedisSchedulerProvider({ client })
		await first.start()
		await second.start()

		const firstClaim = await first.claimOccurrence(occurrence)
		if (!firstClaim) {
			throw new Error('Expected the first provider to claim the occurrence')
		}
		client.expire(`purista:scheduler:claim:${occurrence.occurrenceId}`)
		const failoverClaim = await second.claimOccurrence(occurrence)
		if (!failoverClaim) {
			throw new Error('Expected the second provider to claim the expired occurrence')
		}

		await first.completeOccurrence(firstClaim)
		expect(await first.claimOccurrence(occurrence)).toBeUndefined()
		await second.completeOccurrence(failoverClaim)
		expect(await first.claimOccurrence(occurrence)).toBeUndefined()
	})

	it('keeps only the latest completed instant per schedule while rejecting an old occurrence', async () => {
		const client = new MemoryRedisClient()
		const provider = new RedisSchedulerProvider({ client })
		await provider.start()
		const firstClaim = await provider.claimOccurrence(occurrence)
		if (!firstClaim) {
			throw new Error('Expected the first occurrence to be claimed')
		}
		await provider.completeOccurrence(firstClaim)

		const laterOccurrence: SchedulerOccurrence = {
			...occurrence,
			occurrenceId: 'monthly-cycle:2026-09-21T00:00:00.000Z',
			scheduledAt: '2026-09-21T00:00:00.000Z',
		}
		const laterClaim = await provider.claimOccurrence(laterOccurrence)
		if (!laterClaim) {
			throw new Error('Expected a later occurrence to be claimed')
		}
		await provider.completeOccurrence(laterClaim)

		expect(await provider.claimOccurrence(occurrence)).toBeUndefined()
	})

	it('does not close an application-managed client', async () => {
		const client = new MemoryRedisClient()
		const provider = new RedisSchedulerProvider({ client })
		await provider.start()
		await provider.destroy()

		expect(client.isOpen).toBe(true)
	})
})
