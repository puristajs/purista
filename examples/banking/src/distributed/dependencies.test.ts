import { afterEach, describe, expect, it } from 'vitest'

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

describe.runIf(process.env.PURISTA_BANKING_DISTRIBUTED_TEST === '1')('real distributed banking dependencies', () => {
	const running: Array<ReturnType<typeof createDistributedBankingDependencies>> = []

	afterEach(async () => {
		for (const dependencies of running.splice(0)) {
			await dependencies.queueBridge.destroy()
			await dependencies.eventBridge.destroy()
		}
	})

	it('starts strict JetStream and preserves a Redis enqueue idempotency key', async () => {
		const dependencies = createDistributedBankingDependencies()
		running.push(dependencies)
		await dependencies.eventBridge.start()
		await dependencies.queueBridge.start()
		expect(dependencies.eventBridge.isJetStreamEnabled).toBe(true)
		const first = await dependencies.queueBridge.enqueue({
			queueName: 'example-bank.distributed-smoke',
			payload: { kind: 'smoke' },
			idempotencyKey: 'distributed-smoke-v1',
		})
		const duplicate = await dependencies.queueBridge.enqueue({
			queueName: 'example-bank.distributed-smoke',
			payload: { kind: 'smoke' },
			idempotencyKey: 'distributed-smoke-v1',
		})
		expect(duplicate.jobId).toBe(first.jobId)
	})
})
