import { randomUUID } from 'node:crypto'
import { emitWarning } from 'node:process'

import type { StartedNatsContainer } from '@testcontainers/nats'
import { NatsContainer } from '@testcontainers/nats'
import type { ConnectionOptions } from 'nats'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { describeQueueBridgeContract } from '../../core/test/helpers/queueBridgeContractSuite.js'
import { NatsQueueBridge } from '../src/NatsQueueBridge.impl.js'

const NATS_IMAGE = 'nats:2.10-alpine'

let container: StartedNatsContainer | undefined
let dockerAvailable = true
let connectionOptions: ConnectionOptions | undefined

beforeAll(async () => {
	try {
		container = await new NatsContainer(NATS_IMAGE).withJetStream().withStartupTimeout(30000).start()
		connectionOptions = container.getConnectionOptions()
	} catch (err) {
		dockerAvailable = false
		emitWarning(
			`Skipping nats queue bridge tests because Docker is unavailable: ${err instanceof Error ? err.message : String(err)}`,
			'NatsQueueBridge',
		)
	}
})

describeQueueBridgeContract('@purista/nats-queue-bridge contract', {
	shouldSkip: () => !dockerAvailable,
	createBridge: () =>
		new NatsQueueBridge({
			connectionOptions,
			subjectPrefix: `contract.queue.${Date.now()}`,
		}),
})

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('@purista/nats-queue-bridge strict idempotency', () => {
	let bridge: NatsQueueBridge | undefined

	beforeEach(async () => {
		if (!dockerAvailable) {
			return
		}
		bridge = new NatsQueueBridge({
			connectionOptions,
			subjectPrefix: `idempotency.queue.${Date.now()}.${randomUUID()}`,
		})
		await bridge.start()
	})

	afterEach(async () => {
		await bridge?.destroy()
		bridge = undefined
	})

	const ensureReady = () => {
		if (!dockerAvailable || !bridge) {
			expect(true).toBe(true)
			return false
		}
		return true
	}

	const leaseAllAvailable = async (queueName: string) => {
		if (!bridge) {
			throw new Error('Queue bridge is not initialized')
		}

		const leases = []
		for (;;) {
			const lease = await bridge.leaseNext(queueName, { waitTimeMs: 10 })
			if (!lease) {
				return leases
			}
			leases.push(lease)
			await bridge.ack(queueName, lease.leaseId)
		}
	}

	it('advertises strict idempotency enforcement', async () => {
		if (!ensureReady()) {
			return
		}

		expect(bridge?.capabilities.idempotencyEnforcement).toBe(true)
	})

	it('returns the original enqueue result for duplicate idempotency keys', async () => {
		if (!ensureReady() || !bridge) {
			return
		}

		const queueName = `idempotent-${randomUUID()}`
		const first = await bridge.enqueue({
			queueName,
			payload: { value: 1 },
			idempotencyKey: 'same-key',
		})
		const duplicate = await bridge.enqueue({
			queueName,
			payload: { value: 2 },
			idempotencyKey: 'same-key',
		})

		expect(duplicate).toStrictEqual(first)

		const leases = await leaseAllAvailable(queueName)
		expect(leases).toHaveLength(1)
		expect(leases[0]?.message.id).toBe(first.jobId)
		expect(leases[0]?.message.payload).toStrictEqual({ value: 1 })
	})

	it('creates a second job for a different idempotency key', async () => {
		if (!ensureReady() || !bridge) {
			return
		}

		const queueName = `idempotent-different-${randomUUID()}`
		const first = await bridge.enqueue({
			queueName,
			payload: { value: 1 },
			idempotencyKey: 'key-1',
		})
		const second = await bridge.enqueue({
			queueName,
			payload: { value: 2 },
			idempotencyKey: 'key-2',
		})

		expect(second.jobId).not.toBe(first.jobId)

		const leases = await leaseAllAvailable(queueName)
		expect(leases).toHaveLength(2)
		expect(leases.map(lease => lease.message.id).sort()).toStrictEqual([first.jobId, second.jobId].sort())
	})

	it('creates new jobs when no idempotency key is provided', async () => {
		if (!ensureReady() || !bridge) {
			return
		}

		const queueName = `non-idempotent-${randomUUID()}`
		const first = await bridge.enqueue({ queueName, payload: { value: 1 } })
		const second = await bridge.enqueue({ queueName, payload: { value: 2 } })

		expect(second.jobId).not.toBe(first.jobId)

		const leases = await leaseAllAvailable(queueName)
		expect(leases).toHaveLength(2)
	})

	it('returns the original scheduled result for duplicate delayed enqueue', async () => {
		if (!ensureReady() || !bridge) {
			return
		}

		const queueName = `idempotent-delayed-${randomUUID()}`
		const first = await bridge.enqueue({
			queueName,
			payload: { value: 1 },
			delayMs: 150,
			idempotencyKey: 'same-delayed-key',
		})
		const duplicate = await bridge.enqueue({
			queueName,
			payload: { value: 2 },
			delayMs: 150,
			idempotencyKey: 'same-delayed-key',
		})

		expect(duplicate).toStrictEqual(first)

		const immediateLeases = await leaseAllAvailable(queueName)
		expect(immediateLeases).toHaveLength(0)

		await delay(200)

		const delayedLeases = await leaseAllAvailable(queueName)
		expect(delayedLeases).toHaveLength(1)
		expect(delayedLeases[0]?.message.id).toBe(first.jobId)
		expect(delayedLeases[0]?.message.payload).toStrictEqual({ value: 1 })
	})
})

afterAll(async () => {
	await container?.stop()
})
