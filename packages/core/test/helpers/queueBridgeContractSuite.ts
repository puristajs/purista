import { randomUUID } from 'node:crypto'

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import type { QueueBridge } from '../../src/core/QueueBridge/types/QueueBridge.js'

type Awaitable<T> = T | Promise<T>

export type QueueBridgeContractConfig = {
	createBridge: () => Awaitable<QueueBridge>
	cleanup?: (bridge: QueueBridge) => Awaitable<void>
	beforeAll?: () => Awaitable<void>
	afterAll?: () => Awaitable<void>
	shouldSkip?: () => boolean
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const describeQueueBridgeContract = (title: string, config: QueueBridgeContractConfig) => {
	describe(title, () => {
		let bridge: QueueBridge | undefined
		let skipCurrent = false

		beforeAll(async () => {
			await config.beforeAll?.()
		})

		afterAll(async () => {
			await config.afterAll?.()
		})

		beforeEach(async () => {
			skipCurrent = !!config.shouldSkip?.()
			if (skipCurrent) {
				bridge = undefined
				return
			}

			bridge = await config.createBridge()
			await bridge.start()
		})

		afterEach(async () => {
			if (!bridge) {
				return
			}

			try {
				await config.cleanup?.(bridge)
			} finally {
				await bridge.destroy()
				bridge = undefined
			}
		})

		const ensureReady = () => {
			if (skipCurrent || !bridge) {
				expect(true).toBe(true)
				return false
			}
			return true
		}

		const waitForLease = async (queueName: string, attempts = 20) => {
			for (let attempt = 0; attempt < attempts; attempt++) {
				const lease = await bridge!.leaseNext(queueName, { waitTimeMs: 50 })
				if (lease) {
					return lease
				}
				await delay(25)
			}
			throw new Error(`Queue ${queueName} did not yield a lease within timeout`)
		}

		it('leases and acknowledges jobs', async () => {
			if (!ensureReady()) {
				return
			}

			const queueName = `contract-basic-${randomUUID()}`
			await bridge!.enqueue({
				queueName,
				payload: { foo: 'bar' },
			})

			const lease = await waitForLease(queueName)
			expect(lease.message.payload).toStrictEqual({ foo: 'bar' })

			await bridge!.ack(queueName, lease.leaseId)

			const metrics = await bridge!.metrics(queueName)
			expect(metrics.pending).toBe(0)
			expect(metrics.inflight).toBe(0)
			expect(metrics.deadLetter).toBe(0)
		})

		it('delays jobs and releases them after the scheduled time', async () => {
			if (!ensureReady()) {
				return
			}

			const queueName = `contract-delay-${randomUUID()}`
			await bridge!.enqueue({
				queueName,
				payload: { slow: true },
				delayMs: 150,
			})

			const immediateLease = await bridge!.leaseNext(queueName, { waitTimeMs: 10 })
			expect(immediateLease).toBeUndefined()

			await delay(180)

			const delayedLease = await waitForLease(queueName)
			expect(delayedLease.message.payload).toStrictEqual({ slow: true })
			await bridge!.ack(queueName, delayedLease.leaseId)
		})

		it('retries jobs and moves them to the dead-letter queue after max attempts', async () => {
			if (!ensureReady()) {
				return
			}

			const queueName = `contract-retry-${randomUUID()}`
			await bridge!.enqueue({
				queueName,
				payload: { id: 'job' },
				maxAttempts: 2,
			})

			const firstLease = await waitForLease(queueName)
			await bridge!.nack(queueName, firstLease.leaseId, { delayMs: 75, reason: 'fail-1' })

			const beforeDelayLease = await bridge!.leaseNext(queueName, { waitTimeMs: 10 })
			expect(beforeDelayLease).toBeUndefined()

			await delay(100)

			const secondLease = await waitForLease(queueName)
			expect(secondLease.message.attempt).toBeGreaterThanOrEqual(2)

			await bridge!.nack(queueName, secondLease.leaseId, { reason: 'fail-2' })

			const metrics = await bridge!.metrics(queueName)
			expect(metrics.deadLetter).toBeGreaterThanOrEqual(1)
		})

		it('moves jobs to explicit dead-letter destinations when requested', async () => {
			if (!ensureReady()) {
				return
			}

			const queueName = `contract-manual-${randomUUID()}`
			await bridge!.enqueue({
				queueName,
				payload: { id: 'manual' },
			})

			const lease = await waitForLease(queueName)
			const dlqName = `${queueName}.manual`

			await bridge!.moveToDeadLetter(dlqName, lease.message, 'manual-move')

			const dlqMetrics = await bridge!.metrics(dlqName)
			expect(dlqMetrics.deadLetter).toBeGreaterThanOrEqual(1)
		})
	})
}
