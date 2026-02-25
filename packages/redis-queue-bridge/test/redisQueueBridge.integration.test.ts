import { randomUUID } from 'node:crypto'

import type { StartedTestContainer } from 'testcontainers'
import { GenericContainer, Wait } from 'testcontainers'
import { describe, expect, it } from 'vitest'

import { describeQueueBridgeContract } from '../../core/test/helpers/queueBridgeContractSuite.js'
import { RedisQueueBridge } from '../src/RedisQueueBridge.impl.js'

const REDIS_PORT = 6379

let container: StartedTestContainer | undefined
let dockerAvailable = true
let redisUrl: string | undefined

describeQueueBridgeContract('@purista/redis-queue-bridge contract', {
	beforeAll: async () => {
		try {
			container = await new GenericContainer('redis:7')
				.withExposedPorts(REDIS_PORT)
				.withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
				.start()
			redisUrl = `redis://127.0.0.1:${container.getMappedPort(REDIS_PORT)}`
		} catch (err) {
			dockerAvailable = false
			console.warn('Skipping redis queue bridge contract tests because Docker is unavailable', err)
		}
	},
	afterAll: async () => {
		await container?.stop()
	},
	shouldSkip: () => !dockerAvailable,
	createBridge: () =>
		new RedisQueueBridge({
			config: {
				url: redisUrl ?? `redis://127.0.0.1:${REDIS_PORT}`,
			},
			keyPrefix: `contract:${randomUUID()}:`,
		}),
})

describe('RedisQueueBridge specific behaviour', () => {
	it('exposes queue metrics', async () => {
		if (!dockerAvailable) {
			expect(true).toBe(true)
			return
		}

		const bridge = new RedisQueueBridge({
			config: {
				url: redisUrl ?? `redis://127.0.0.1:${REDIS_PORT}`,
			},
			keyPrefix: `metrics:${randomUUID()}:`,
		})
		await bridge.start()

		const queueName = `metrics-${randomUUID()}`
		await bridge.enqueue({ queueName, payload: { ping: true } })

		const metrics = await bridge.metrics(queueName)
		expect(metrics.pending).toBe(1)
		expect(metrics.inflight).toBe(0)

		await bridge.destroy()
	})
})
