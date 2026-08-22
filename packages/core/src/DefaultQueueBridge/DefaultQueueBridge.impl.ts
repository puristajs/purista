import { randomUUID } from 'node:crypto'

import type { PuristaMetricsRecorder } from '../core/metrics/types.js'
import type { QueueBridge } from '../core/QueueBridge/types/QueueBridge.js'
import type { QueueBridgeCapabilities } from '../core/QueueBridge/types/QueueBridgeCapabilities.js'
import type { QueueDeadLetterListOptions } from '../core/QueueBridge/types/QueueDeadLetterListOptions.js'
import type { QueueDeadLetterRedriveOptions } from '../core/QueueBridge/types/QueueDeadLetterRedriveOptions.js'
import type { QueueEnqueueResult } from '../core/QueueBridge/types/QueueEnqueueResult.js'
import type { QueueLeaseInspectionRecord } from '../core/QueueBridge/types/QueueLeaseInspectionRecord.js'
import type { QueueLeaseOptions } from '../core/QueueBridge/types/QueueLeaseOptions.js'
import type { QueueRetryRequest } from '../core/QueueBridge/types/QueueRetryRequest.js'
import type { QueueEnqueueOptions } from '../core/types/queue/QueueEnqueueOptions.js'
import type { QueueLease } from '../core/types/queue/QueueLease.js'
import type { QueueMessage } from '../core/types/queue/QueueMessage.js'
import type { QueueMetrics } from '../core/types/queue/QueueMetrics.js'
import type { ServiceObservabilityContext } from '../core/types/ServiceObservability.js'

type LeaseEntry = {
	leaseId: string
	message: QueueMessage
	expiresAt: number
	queueName: string
}

/**
 * Configuration for the process-local {@link DefaultQueueBridge}.
 *
 * The default bridge is intended for local development and tests. It is not a
 * durable production queue and does not enforce strict idempotency.
 *
 * @group Queue bridge
 */
export type DefaultQueueBridgeOptions = {
	/** Optional stable bridge instance id. */
	instanceId?: string
	/** Default lease duration in milliseconds for enqueued jobs. */
	defaultLeaseTtlMs?: number
	/** Default maximum attempts before dead-letter handling. */
	maxAttempts?: number
	/** Optional recorder for queue framework metrics. */
	metricsRecorder?: PuristaMetricsRecorder
}

/**
 * In-memory queue bridge for development and unit tests.
 *
 * Jobs, leases, and dead letters are stored in process memory and are lost on
 * shutdown. The bridge reports advisory reliability semantics: delayed
 * delivery and FIFO behavior are local only, while idempotency enforcement and
 * exactly-once delivery are intentionally unsupported.
 *
 * @example
 * ```ts
 * const queueBridge = new DefaultQueueBridge({ defaultLeaseTtlMs: 60_000 })
 * await queueBridge.enqueue({ queueName: 'orders', payload: { id: 'ord_1' } })
 * ```
 *
 * @group Queue bridge
 */
export class DefaultQueueBridge implements QueueBridge {
	/** Human-readable bridge name used in diagnostics and metrics. */
	public readonly name = 'DefaultQueueBridge'

	/** Process-local capability matrix for strict startup validation. */
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
		deadLetterInspectSupported: true,
		deadLetterReplaySupported: true,
		deadLetterPurgeSupported: true,
		leaseInspectionSupported: false,
		idempotencyEnforcement: false,
		partitionOrdering: false,
		providerManagedDelayedDelivery: false,
		strictStartupValidation: true,
	}

	/** Runtime instance id for this in-memory bridge instance. */
	public readonly instanceId: string

	private readonly defaultLeaseTtlMs: number
	private readonly defaultMaxAttempts: number
	private metricsRecorder?: PuristaMetricsRecorder
	private readonly hasExplicitMetricsRecorder: boolean
	private readonly queues = new Map<string, QueueMessage[]>()
	private readonly leases = new Map<string, Map<string, LeaseEntry>>()
	private readonly deadLetters = new Map<string, QueueMessage[]>()

	constructor(options?: DefaultQueueBridgeOptions) {
		this.instanceId = options?.instanceId ?? randomUUID()
		this.defaultLeaseTtlMs = options?.defaultLeaseTtlMs ?? 30_000
		this.defaultMaxAttempts = options?.maxAttempts ?? 5
		this.metricsRecorder = options?.metricsRecorder
		this.hasExplicitMetricsRecorder = options?.metricsRecorder !== undefined
	}

	/** Inherit the service metrics recorder unless the bridge received one explicitly. */
	inheritServiceObservability(context: ServiceObservabilityContext): void {
		if (!this.hasExplicitMetricsRecorder && context.metricsRecorder) {
			this.metricsRecorder = context.metricsRecorder
		}
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
		const startedAt = Date.now()
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
		this.recordQueueOperation(queueName, 'enqueue', startedAt, 'success')
		this.recordQueueJobs(queueName, 'pending', 1)

		return { jobId, queueName, scheduledAt }
	}

	async leaseNext(queueName: string, _opts?: QueueLeaseOptions): Promise<QueueLease | undefined> {
		const startedAt = Date.now()
		this.recoverExpiredLeases(queueName)
		const queue = this.queues.get(queueName)
		if (!queue || queue.length === 0) {
			this.recordQueueOperation(queueName, 'poll', startedAt, 'success')
			return undefined
		}
		const now = Date.now()

		// find first scheduled job ready to run
		const idx = queue.findIndex(item => (item.scheduledAt ?? 0) <= now)
		if (idx === -1) {
			this.recordQueueOperation(queueName, 'poll', startedAt, 'success')
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
		this.recordQueueOperation(queueName, 'poll', startedAt, 'success')
		this.recordQueueJobs(queueName, 'pending', -1)
		this.recordQueueJobs(queueName, 'inflight', 1)

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
		const startedAt = Date.now()
		const leaseEntries = this.leases.get(queueName)
		leaseEntries?.delete(leaseId)
		this.recordQueueOperation(queueName, 'ack', startedAt, 'success')
		this.recordQueueJobs(queueName, 'inflight', -1)
	}

	async nack(queueName: string, leaseId: string, request: QueueRetryRequest): Promise<void> {
		const startedAt = Date.now()
		const leaseEntries = this.leases.get(queueName)
		const lease = leaseEntries?.get(leaseId)
		if (!leaseEntries || !lease) {
			this.recordQueueOperation(queueName, 'nack', startedAt, 'success')
			return
		}

		leaseEntries.delete(leaseId)

		const message = lease.message
		this.applyRetryReason(message, request.reason)
		message.leaseExpiresAt = 0
		message.scheduledAt = request.delayMs ? Date.now() + request.delayMs : Date.now()

		if (message.attempt >= message.maxAttempts) {
			await this.moveToDeadLetter(queueName, message, request.reason ?? 'max_attempts_exceeded')
			this.recordQueueOperation(queueName, 'dead_letter', startedAt, 'success')
			return
		}

		const queue = this.queues.get(queueName) ?? []
		queue.push(message)
		this.queues.set(queueName, queue)
		this.recordQueueOperation(queueName, 'retry', startedAt, 'success')
		this.recordQueueJobs(queueName, 'inflight', -1)
		this.recordQueueJobs(queueName, 'retry', 1)
	}

	async moveToDeadLetter(queueName: string, message: QueueMessage, reason?: string): Promise<void> {
		const startedAt = Date.now()
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
		this.recordQueueOperation(queueName, 'dead_letter', startedAt, 'success')
		this.recordQueueJobs(queueName, 'dead_letter', 1)
	}

	async peekDeadLetter(queueName: string, options?: QueueDeadLetterListOptions): Promise<QueueMessage[]> {
		const dlq = this.deadLetters.get(queueName) ?? []
		const offset = options?.offset ?? 0
		const limit = options?.limit ?? dlq.length
		return dlq.slice(offset, offset + limit)
	}

	async redriveDeadLetter(queueName: string, options?: QueueDeadLetterRedriveOptions): Promise<number> {
		const dlq = this.deadLetters.get(queueName) ?? []
		if (dlq.length === 0) {
			return 0
		}

		const limit = options?.limit ?? dlq.length
		const queue = this.queues.get(queueName) ?? []
		const now = Date.now()
		const replay = dlq.splice(0, limit)

		for (const message of replay) {
			message.leaseExpiresAt = 0
			message.scheduledAt = now
			queue.push(message)
		}

		this.queues.set(queueName, queue)
		this.deadLetters.set(queueName, dlq)
		return replay.length
	}

	async purgeDeadLetter(queueName: string): Promise<number> {
		const dlq = this.deadLetters.get(queueName) ?? []
		this.deadLetters.delete(queueName)
		return dlq.length
	}

	async inspectLeases(
		_queueName: string,
		_options?: QueueDeadLetterListOptions,
	): Promise<QueueLeaseInspectionRecord[]> {
		return []
	}

	async metrics(queueName: string): Promise<QueueMetrics> {
		const startedAt = Date.now()
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

		const result = {
			pending,
			inflight: inflight.size,
			deadLetter: dlq.length,
			retries,
			oldestAgeMs,
		}
		this.recordQueueOperation(queueName, 'metrics', startedAt, 'success')
		this.recordQueueJobs(queueName, 'pending', result.pending)
		this.recordQueueJobs(queueName, 'inflight', result.inflight)
		this.recordQueueJobs(queueName, 'dead_letter', result.deadLetter)
		this.recordQueueJobs(queueName, 'retry', result.retries)
		if (typeof result.oldestAgeMs === 'number') {
			this.recordFrameworkMetric('purista.queue.oldest_job_age', result.oldestAgeMs, {
				'purista.queue.name': queueName,
			})
		}
		return result
	}

	private recordQueueOperation(queueName: string, operation: string, startedAt: number, outcome: string) {
		this.recordFrameworkMetric('purista.queue.operation.duration', Math.max(0, Date.now() - startedAt), {
			'purista.queue.name': queueName,
			'purista.queue.operation': operation,
			'purista.outcome': outcome,
		})
	}

	private recordQueueJobs(queueName: string, state: string, value: number) {
		this.recordFrameworkMetric('purista.queue.jobs', value, {
			'purista.queue.name': queueName,
			'purista.queue.state': state,
		})
	}

	private recordFrameworkMetric(name: string, value: number, attributes: Record<string, string | number | boolean>) {
		try {
			this.metricsRecorder?.recordFrameworkMetric(name, value, attributes)
		} catch {
			return
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
