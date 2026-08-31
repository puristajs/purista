import { describe, expect, it } from 'vitest'

import { createDistributedBankingDependencies } from './dependencies.js'

describe('distributed banking dependencies', () => {
	it('uses strict JetStream and a separate Redis queue namespace', () => {
		const dependencies = createDistributedBankingDependencies({
			BANKING_NATS_URL: 'nats://broker.internal:4222',
			BANKING_REDIS_URL: 'redis://queue.internal:6379',
		})
		expect(dependencies.eventBridge.name).toBe('NatsBridge')
		expect(dependencies.queueBridge.name).toBe('RedisQueueBridge')
	})
})
