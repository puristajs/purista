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

		const getBridgeOrThrow = () => {
			if (!bridge) {
				throw new Error('Queue bridge is not initialized')
			}
			return bridge
		}

		const waitForLease = async (queueName: string, attempts = 20) => {
			const activeBridge = getBridgeOrThrow()
			for (let attempt = 0; attempt < attempts; attempt++) {
				const lease = await activeBridge.leaseNext(queueName, { waitTimeMs: 50 })
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
			const activeBridge = getBridgeOrThrow()
			await activeBridge.enqueue({
				queueName,
				payload: { foo: 'bar' },
			})

			const lease = await waitForLease(queueName)
			expect(lease.message.payload).toStrictEqual({ foo: 'bar' })

			await activeBridge.ack(queueName, lease.leaseId)

			const metrics = await activeBridge.metrics(queueName)
			expect(metrics.pending).toBe(0)
			expect(metrics.inflight).toBe(0)
			expect(metrics.deadLetter).toBe(0)
		})

		it('delays jobs and releases them after the scheduled time', async () => {
			if (!ensureReady()) {
				return
			}

			const queueName = `contract-delay-${randomUUID()}`
			const activeBridge = getBridgeOrThrow()
			await activeBridge.enqueue({
				queueName,
				payload: { slow: true },
				delayMs: 150,
			})

			const immediateLease = await activeBridge.leaseNext(queueName, { waitTimeMs: 10 })
			expect(immediateLease).toBeUndefined()

			await delay(180)

			const delayedLease = await waitForLease(queueName)
			expect(delayedLease.message.payload).toStrictEqual({ slow: true })
			await activeBridge.ack(queueName, delayedLease.leaseId)
		})

		it('retries jobs and moves them to the dead-letter queue after max attempts', async () => {
			if (!ensureReady()) {
				return
			}

			const queueName = `contract-retry-${randomUUID()}`
			const activeBridge = getBridgeOrThrow()
			await activeBridge.enqueue({
				queueName,
				payload: { id: 'job' },
				maxAttempts: 2,
			})

			const firstLease = await waitForLease(queueName)
			await activeBridge.nack(queueName, firstLease.leaseId, { delayMs: 75, reason: 'fail-1' })

			const beforeDelayLease = await activeBridge.leaseNext(queueName, { waitTimeMs: 10 })
			expect(beforeDelayLease).toBeUndefined()

			await delay(100)

			const secondLease = await waitForLease(queueName)
			expect(secondLease.message.attempt).toBeGreaterThanOrEqual(2)

			await activeBridge.nack(queueName, secondLease.leaseId, { reason: 'fail-2' })

			const metrics = await activeBridge.metrics(queueName)
			expect(metrics.deadLetter).toBeGreaterThanOrEqual(1)
		})

		it('moves jobs to explicit dead-letter destinations when requested', async () => {
			if (!ensureReady()) {
				return
			}

			const queueName = `contract-manual-${randomUUID()}`
			const activeBridge = getBridgeOrThrow()
			await activeBridge.enqueue({
				queueName,
				payload: { id: 'manual' },
			})

			const lease = await waitForLease(queueName)
			const dlqName = `${queueName}.manual`

			await activeBridge.moveToDeadLetter(dlqName, lease.message, 'manual-move')

			const dlqMetrics = await activeBridge.metrics(dlqName)
			expect(dlqMetrics.deadLetter).toBeGreaterThanOrEqual(1)
		})

		it('supports dead-letter inspection, replay, and purge when advertised', async () => {
			if (!ensureReady()) {
				return
			}

			const queueName = `contract-dlq-ops-${randomUUID()}`
			const dlqName = `${queueName}.manual`
			const activeBridge = getBridgeOrThrow()

			await activeBridge.enqueue({
				queueName,
				payload: { id: 'dlq-ops' },
			})

			const lease = await waitForLease(queueName)
			await activeBridge.moveToDeadLetter(dlqName, lease.message, 'operator-test')

			if (activeBridge.capabilities.deadLetterInspectSupported) {
				const entries = await activeBridge.peekDeadLetter(dlqName, { limit: 10 })
				expect(entries.length).toBeGreaterThanOrEqual(1)
				expect(entries[0]?.headers?.['x-purista-dead-letter-reason']).toBe('operator-test')
			}

			if (activeBridge.capabilities.deadLetterReplaySupported) {
				const replayed = await activeBridge.redriveDeadLetter(dlqName, { limit: 1 })
				expect(replayed).toBe(1)
			}

			if (activeBridge.capabilities.deadLetterPurgeSupported) {
				await activeBridge.moveToDeadLetter(dlqName, lease.message, 'purge-test')
				const purged = await activeBridge.purgeDeadLetter(dlqName)
				expect(purged).toBeGreaterThanOrEqual(1)
			}
		})

		it('recovers expired leases and requeues the job', async () => {
			if (!ensureReady()) {
				return
			}

			const queueName = `contract-expire-${randomUUID()}`
			const activeBridge = getBridgeOrThrow()
			await activeBridge.enqueue({
				queueName,
				payload: { id: 'expiring-job' },
				maxAttempts: 3,
				leaseTtlMs: 40,
			})

			const firstLease = await waitForLease(queueName)
			expect(firstLease.message.attempt).toBe(1)

			await delay(80)

			const recoveredLease = await waitForLease(queueName)
			expect(recoveredLease.message.id).toBe(firstLease.message.id)
			expect(recoveredLease.message.attempt).toBeGreaterThanOrEqual(2)
			await activeBridge.ack(queueName, recoveredLease.leaseId)
		})

		it('exposes lease inspection when advertised', async () => {
			if (!ensureReady()) {
				return
			}

			const queueName = `contract-inspect-${randomUUID()}`
			const activeBridge = getBridgeOrThrow()
			await activeBridge.enqueue({
				queueName,
				payload: { id: 'inspect' },
				leaseTtlMs: 500,
			})

			const lease = await waitForLease(queueName)

			if (activeBridge.capabilities.leaseInspectionSupported) {
				const records = await activeBridge.inspectLeases(queueName, { limit: 10 })
				expect(records.some(record => record.leaseId === lease.leaseId && record.jobId === lease.message.id)).toBe(true)
			} else {
				const records = await activeBridge.inspectLeases(queueName, { limit: 10 })
				expect(records).toStrictEqual([])
			}

			await activeBridge.ack(queueName, lease.leaseId)
		})
	})
}
