import { randomUUID } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { describeQueueBridgeContract } from '../../test/helpers/queueBridgeContractSuite.js'
import { DefaultQueueBridge } from './DefaultQueueBridge.impl.js'

describeQueueBridgeContract('DefaultQueueBridge contract', {
	createBridge: () => new DefaultQueueBridge({ defaultLeaseTtlMs: 1_000, maxAttempts: 2 }),
})

describe('DefaultQueueBridge specifics', () => {
	it('extends leases when requested', async () => {
		const bridge = new DefaultQueueBridge({ defaultLeaseTtlMs: 100 })
		await bridge.start()

		const queueName = `lease-${randomUUID()}`
		await bridge.enqueue({
			queueName,
			payload: { id: 'job-1' },
		})

		const lease = await bridge.leaseNext(queueName)
		expect(lease).toBeDefined()
		if (!lease) {
			throw new Error('Failed to lease job')
		}

		const originalExpiry = lease.message.leaseExpiresAt
		await bridge.extendLease(queueName, lease.leaseId, 200)

		expect(lease.message.leaseExpiresAt).toBeGreaterThan(originalExpiry)

		await bridge.ack(queueName, lease.leaseId)
		await bridge.destroy()
	})
})
