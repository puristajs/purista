import { randomUUID } from 'node:crypto'
import { emitWarning } from 'node:process'

import { createClient } from '@redis/client'
import type { StartedTestContainer } from 'testcontainers'
import { GenericContainer, Wait } from 'testcontainers'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { describeQueueBridgeContract } from '../../core/test/helpers/queueBridgeContractSuite.js'
import { RedisQueueBridge } from '../src/RedisQueueBridge.impl.js'

const REDIS_PORT = 6379
const REDIS_IMAGE = 'redis:7.2-alpine'

let container: StartedTestContainer | undefined
let dockerAvailable = true
let redisUrl: string | undefined

describeQueueBridgeContract('@purista/redis-queue-bridge contract', {
	beforeAll: async () => {
		try {
			container = await new GenericContainer(REDIS_IMAGE)
				.withExposedPorts(REDIS_PORT)
				.withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
				.start()
			redisUrl = `redis://127.0.0.1:${container.getMappedPort(REDIS_PORT)}`
		} catch (err) {
			dockerAvailable = false
			emitWarning(
				`Skipping redis queue bridge contract tests because Docker is unavailable: ${err instanceof Error ? err.message : String(err)}`,
				'RedisQueueBridge',
			)
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
	let metricsContainer: StartedTestContainer | undefined
	let metricsRedisUrl: string | undefined
	let metricsDockerAvailable = true

	beforeAll(async () => {
		if (!dockerAvailable) {
			metricsDockerAvailable = false
			return
		}

		try {
			metricsContainer = await new GenericContainer(REDIS_IMAGE)
				.withExposedPorts(REDIS_PORT)
				.withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
				.start()
			metricsRedisUrl = `redis://127.0.0.1:${metricsContainer.getMappedPort(REDIS_PORT)}`
		} catch (err) {
			metricsDockerAvailable = false
			emitWarning(
				`Skipping redis queue bridge specific tests because Docker is unavailable: ${err instanceof Error ? err.message : String(err)}`,
				'RedisQueueBridge',
			)
		}
	})

	afterAll(async () => {
		await metricsContainer?.stop()
	})

	it('exposes queue metrics', async () => {
		if (!metricsDockerAvailable) {
			expect(true).toBe(true)
			return
		}

		const bridge = new RedisQueueBridge({
			config: {
				url: metricsRedisUrl ?? `redis://127.0.0.1:${REDIS_PORT}`,
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

	it('recovers an expired lease exactly once across competing workers', async () => {
		if (!metricsDockerAvailable) {
			expect(true).toBe(true)
			return
		}

		const keyPrefix = `competing-workers:${randomUUID()}:`
		const queueName = `orders-${randomUUID()}`
		const bridgeA = new RedisQueueBridge({
			config: {
				url: metricsRedisUrl ?? `redis://127.0.0.1:${REDIS_PORT}`,
			},
			keyPrefix,
		})
		const bridgeB = new RedisQueueBridge({
			config: {
				url: metricsRedisUrl ?? `redis://127.0.0.1:${REDIS_PORT}`,
			},
			keyPrefix,
		})

		await bridgeA.start()
		await bridgeB.start()

		try {
			await bridgeA.enqueue({
				queueName,
				payload: { orderId: 'order-1' },
				maxAttempts: 3,
				leaseTtlMs: 40,
			})

			const firstLease = await bridgeA.leaseNext(queueName, { waitTimeMs: 100 })
			expect(firstLease).toBeDefined()

			await new Promise(resolve => setTimeout(resolve, 80))

			const [recoveredA, recoveredB] = await Promise.all([
				bridgeA.leaseNext(queueName, { waitTimeMs: 50 }),
				bridgeB.leaseNext(queueName, { waitTimeMs: 50 }),
			])

			const recoveredLeases = [recoveredA, recoveredB].filter(lease => lease !== undefined)

			expect(recoveredLeases).toHaveLength(1)
			expect(recoveredLeases[0]?.message.id).toBe(firstLease?.message.id)
			expect(recoveredLeases[0]?.message.attempt).toBeGreaterThanOrEqual(2)

			if (recoveredLeases[0]) {
				await bridgeA.ack(queueName, recoveredLeases[0].leaseId)
			}

			const metrics = await bridgeA.metrics(queueName)
			expect(metrics.pending).toBe(0)
			expect(metrics.inflight).toBe(0)
			expect(metrics.deadLetter).toBe(0)
		} finally {
			await bridgeA.destroy()
			await bridgeB.destroy()
		}
	})

	it('recovers orphaned processing jobs without lease metadata exactly once across competing workers', async () => {
		if (!metricsDockerAvailable) {
			expect(true).toBe(true)
			return
		}

		const keyPrefix = `orphan-processing:${randomUUID()}:`
		const queueName = `payments-${randomUUID()}`
		const bridgeA = new RedisQueueBridge({
			config: {
				url: metricsRedisUrl ?? `redis://127.0.0.1:${REDIS_PORT}`,
			},
			keyPrefix,
		})
		const bridgeB = new RedisQueueBridge({
			config: {
				url: metricsRedisUrl ?? `redis://127.0.0.1:${REDIS_PORT}`,
			},
			keyPrefix,
		})
		const client = createClient({
			url: metricsRedisUrl ?? `redis://127.0.0.1:${REDIS_PORT}`,
		})

		await bridgeA.start()
		await bridgeB.start()
		await client.connect()

		try {
			await bridgeA.enqueue({
				queueName,
				payload: { paymentId: 'payment-1' },
				maxAttempts: 3,
			})

			await client.lMove(`${keyPrefix}${queueName}:pending`, `${keyPrefix}${queueName}:processing`, 'RIGHT', 'LEFT')

			const [recoveredA, recoveredB] = await Promise.all([
				bridgeA.leaseNext(queueName, { waitTimeMs: 50 }),
				bridgeB.leaseNext(queueName, { waitTimeMs: 50 }),
			])
			const recoveredLeases = [recoveredA, recoveredB].filter(lease => lease !== undefined)

			expect(recoveredLeases).toHaveLength(1)
			expect(recoveredLeases[0]?.message.payload).toStrictEqual({ paymentId: 'payment-1' })

			if (recoveredLeases[0]) {
				await bridgeA.ack(queueName, recoveredLeases[0].leaseId)
			}

			const metrics = await bridgeA.metrics(queueName)
			expect(metrics.pending).toBe(0)
			expect(metrics.inflight).toBe(0)
			expect(metrics.deadLetter).toBe(0)
		} finally {
			await client.disconnect()
			await bridgeA.destroy()
			await bridgeB.destroy()
		}
	})
})
