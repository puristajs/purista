import { randomUUID } from 'node:crypto'

import type { QueueBridge } from '../core/QueueBridge/types/QueueBridge.js'
import type { QueueBridgeCapabilities } from '../core/QueueBridge/types/QueueBridgeCapabilities.js'
import type { QueueEnqueueResult } from '../core/QueueBridge/types/QueueEnqueueResult.js'
import type { QueueLeaseOptions } from '../core/QueueBridge/types/QueueLeaseOptions.js'
import type { QueueRetryRequest } from '../core/QueueBridge/types/QueueRetryRequest.js'
import type { QueueEnqueueOptions } from '../core/types/queue/QueueEnqueueOptions.js'
import type { QueueLease } from '../core/types/queue/QueueLease.js'
import type { QueueMessage } from '../core/types/queue/QueueMessage.js'
import type { QueueMetrics } from '../core/types/queue/QueueMetrics.js'

type LeaseEntry = {
	leaseId: string
	message: QueueMessage
	expiresAt: number
	queueName: string
}

export type DefaultQueueBridgeOptions = {
	instanceId?: string
	defaultLeaseTtlMs?: number
	maxAttempts?: number
}

export class DefaultQueueBridge implements QueueBridge {
	public readonly name = 'DefaultQueueBridge'

	public readonly capabilities: QueueBridgeCapabilities = {
		delayedDelivery: true,
		fifoOrdering: true,
		partitions: false,
		priorities: false,
		deadLetterNative: false,
		exactlyOnce: false,
		maxBatchSize: 1,
		defaultDeadLetterPrefix: '',
		defaultDeadLetterSuffix: '.dead-letter',
		deadLetterInspectable: true,
	}

	public readonly instanceId: string

	private readonly defaultLeaseTtlMs: number
	private readonly defaultMaxAttempts: number
	private readonly queues = new Map<string, QueueMessage[]>()
	private readonly leases = new Map<string, Map<string, LeaseEntry>>()
	private readonly deadLetters = new Map<string, QueueMessage[]>()

	constructor(options?: DefaultQueueBridgeOptions) {
		this.instanceId = options?.instanceId ?? randomUUID()
		this.defaultLeaseTtlMs = options?.defaultLeaseTtlMs ?? 30_000
		this.defaultMaxAttempts = options?.maxAttempts ?? 5
	}

	async start() {}

	async isReady() {
		return true
	}

	async isHealthy() {
		return true
	}

	async destroy() {
		this.queues.clear()
		this.leases.clear()
		this.deadLetters.clear()
	}

	async enqueue(options: QueueEnqueueOptions<unknown, unknown>): Promise<QueueEnqueueResult> {
		const queueName = options.queueName
		const scheduledAt = options.delayMs ? Date.now() + options.delayMs : Date.now()
		const leaseTtlMs = options.leaseTtlMs ?? this.defaultLeaseTtlMs
		const jobId = randomUUID()

		const message: QueueMessage<unknown, unknown> = {
			id: jobId,
			queueName,
			payload: options.payload,
			parameter: options.parameter as unknown,
			headers: options.headers ?? {},
			createdAt: Date.now(),
			scheduledAt,
			priority: options.priority,
			attempt: 0,
			maxAttempts: options.maxAttempts ?? this.defaultMaxAttempts,
			leaseExpiresAt: 0,
			leaseTtlMs,
			idempotencyKey: options.idempotencyKey,
		}

		const queue = this.queues.get(queueName) ?? []
		queue.push(message)
		this.queues.set(queueName, queue)

		return { jobId, queueName, scheduledAt }
	}

	async leaseNext(queueName: string, _opts?: QueueLeaseOptions): Promise<QueueLease | undefined> {
		this.recoverExpiredLeases(queueName)
		const queue = this.queues.get(queueName)
		if (!queue || queue.length === 0) {
			return undefined
		}
		const now = Date.now()

		// find first scheduled job ready to run
		const idx = queue.findIndex(item => (item.scheduledAt ?? 0) <= now)
		if (idx === -1) {
			return undefined
		}

		const [message] = queue.splice(idx, 1)
		message.leaseExpiresAt = now + message.leaseTtlMs
		message.attempt += 1

		const leaseId = randomUUID()
		const lease: QueueLease = {
			id: message.id,
			queueName,
			message,
			leaseId,
			leasedAt: now,
			leaseExpiresAt: message.leaseExpiresAt,
		}

		const leaseEntries = this.leases.get(queueName) ?? new Map<string, LeaseEntry>()
		leaseEntries.set(leaseId, {
			leaseId,
			message,
			expiresAt: message.leaseExpiresAt,
			queueName,
		})
		this.leases.set(queueName, leaseEntries)

		return lease
	}

	async extendLease(queueName: string, leaseId: string, extensionMs: number): Promise<void> {
		const leaseEntries = this.leases.get(queueName)
		const lease = leaseEntries?.get(leaseId)
		if (!lease) {
			return
		}
		lease.expiresAt = Date.now() + extensionMs
		lease.message.leaseExpiresAt = lease.expiresAt
	}

	async ack(queueName: string, leaseId: string): Promise<void> {
		const leaseEntries = this.leases.get(queueName)
		leaseEntries?.delete(leaseId)
	}

	async nack(queueName: string, leaseId: string, request: QueueRetryRequest): Promise<void> {
		const leaseEntries = this.leases.get(queueName)
		const lease = leaseEntries?.get(leaseId)
		if (!leaseEntries || !lease) {
			return
		}

		leaseEntries.delete(leaseId)

		const message = lease.message
		this.applyRetryReason(message, request.reason)
		message.leaseExpiresAt = 0
		message.scheduledAt = request.delayMs ? Date.now() + request.delayMs : Date.now()

		if (message.attempt >= message.maxAttempts) {
			await this.moveToDeadLetter(queueName, message, request.reason ?? 'max_attempts_exceeded')
			return
		}

		const queue = this.queues.get(queueName) ?? []
		queue.push(message)
		this.queues.set(queueName, queue)
	}

	async moveToDeadLetter(queueName: string, message: QueueMessage, reason?: string): Promise<void> {
		const dlq = this.deadLetters.get(queueName) ?? []
		if (reason) {
			message.headers = {
				...message.headers,
				'x-purista-dead-letter-reason': reason,
			}
		}
		message.leaseExpiresAt = 0
		dlq.push(message)
		this.deadLetters.set(queueName, dlq)
	}

	async metrics(queueName: string): Promise<QueueMetrics> {
		this.recoverExpiredLeases(queueName)
		const queue = this.queues.get(queueName) ?? []
		const inflight = this.leases.get(queueName) ?? new Map()
		const dlq = this.deadLetters.get(queueName) ?? []
		const now = Date.now()
		const pending = queue.length
		const retries =
			queue.reduce((count, item) => count + Math.max(0, item.attempt - 1), 0) +
			Array.from(inflight.values()).reduce((count, lease) => count + Math.max(0, lease.message.attempt - 1), 0)
		const oldestAgeMs = queue.length > 0 ? now - (queue[0].createdAt ?? now) : undefined

		return {
			pending,
			inflight: inflight.size,
			deadLetter: dlq.length,
			retries,
			oldestAgeMs,
		}
	}

	private recoverExpiredLeases(queueName: string) {
		const now = Date.now()
		const leaseEntries = this.leases.get(queueName)
		if (!leaseEntries || leaseEntries.size === 0) {
			return
		}

		for (const [leaseId, lease] of Array.from(leaseEntries.entries())) {
			if (lease.expiresAt > now) {
				continue
			}
			leaseEntries.delete(leaseId)

			const message = lease.message
			message.leaseExpiresAt = 0
			this.applyRetryReason(message, 'lease_expired')

			if (message.attempt >= message.maxAttempts) {
				void this.moveToDeadLetter(lease.queueName, message, 'lease_expired')
				continue
			}

			message.scheduledAt = now
			const queue = this.queues.get(lease.queueName) ?? []
			queue.push(message)
			this.queues.set(lease.queueName, queue)
		}
	}

	private applyRetryReason(message: QueueMessage, reason?: string) {
		if (!reason) {
			return
		}
		message.headers = {
			...message.headers,
			'x-purista-last-retry-reason': reason,
		}
	}
}
