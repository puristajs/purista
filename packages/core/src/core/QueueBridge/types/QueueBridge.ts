import type { QueueEnqueueOptions } from '../../types/queue/QueueEnqueueOptions.js'
import type { QueueLease } from '../../types/queue/QueueLease.js'
import type { QueueMessage } from '../../types/queue/QueueMessage.js'
import type { QueueMetrics } from '../../types/queue/QueueMetrics.js'
import type { QueueBridgeCapabilities } from './QueueBridgeCapabilities.js'
import type { QueueDeadLetterListOptions } from './QueueDeadLetterListOptions.js'
import type { QueueDeadLetterRedriveOptions } from './QueueDeadLetterRedriveOptions.js'
import type { QueueEnqueueResult } from './QueueEnqueueResult.js'
import type { QueueLeaseInspectionRecord } from './QueueLeaseInspectionRecord.js'
import type { QueueLeaseOptions } from './QueueLeaseOptions.js'
import type { QueueRetryRequest } from './QueueRetryRequest.js'

/**
 * Queue transport adapter contract used by PURISTA services and queue workers.
 *
 * A queue bridge owns durable or in-memory delivery mechanics: enqueue,
 * leasing, acknowledgement, retry, dead-letter handling, and operational
 * metrics. Adapters must report their actual guarantees through
 * {@link QueueBridge.capabilities}; strict queue definitions rely on those
 * flags during startup and should fail fast when a required guarantee is not
 * available.
 *
 * Queue handlers must still be idempotent. `idempotencyKey` support is an
 * adapter guarantee, not an exactly-once side-effect guarantee.
 *
 * @group Queue bridge
 */
export interface QueueBridge {
	/** Human-readable adapter name used in diagnostics, logs, and metrics. */
	readonly name: string
	/** Stable runtime instance id used to distinguish bridge processes. */
	readonly instanceId: string
	/** Runtime capability matrix used for strict queue validation. */
	readonly capabilities: QueueBridgeCapabilities

	/** Start the bridge and establish any provider connection needed for work. */
	start(): Promise<void>
	/** Returns whether the bridge has completed startup and can accept calls. */
	isReady(): Promise<boolean>
	/** Returns whether the bridge can currently make progress. */
	isHealthy(): Promise<boolean>
	/** Release provider resources and stop background bridge activity. */
	destroy(): Promise<void>

	/** Enqueue a queue message and return provider-visible job metadata. */
	enqueue(options: QueueEnqueueOptions<unknown, unknown>): Promise<QueueEnqueueResult>
	/** Lease the next available message for a worker, if one is ready. */
	leaseNext(queueName: string, options?: QueueLeaseOptions): Promise<QueueLease | undefined>
	/** Extend an active lease so long-running work can continue safely. */
	extendLease(queueName: string, leaseId: string, extensionMs: number): Promise<void>
	/** Acknowledge successful processing and remove the leased message. */
	ack(queueName: string, leaseId: string): Promise<void>
	/** Return a leased message to the queue or move it toward dead-letter policy. */
	nack(queueName: string, leaseId: string, request: QueueRetryRequest): Promise<void>
	/** Move a message to the dead-letter store with an optional safe reason. */
	moveToDeadLetter(queueName: string, message: QueueMessage, reason?: string): Promise<void>
	/** Inspect dead-letter messages without redriving or deleting them. */
	peekDeadLetter(queueName: string, options?: QueueDeadLetterListOptions): Promise<QueueMessage[]>
	/** Move dead-letter messages back to the live queue. */
	redriveDeadLetter(queueName: string, options?: QueueDeadLetterRedriveOptions): Promise<number>
	/** Delete all dead-letter messages for the queue. */
	purgeDeadLetter(queueName: string): Promise<number>
	/** Inspect active leases when the adapter supports lease diagnostics. */
	inspectLeases(queueName: string, options?: QueueDeadLetterListOptions): Promise<QueueLeaseInspectionRecord[]>
	/** Return queue-level operational metrics for health and dashboards. */
	metrics(queueName: string): Promise<QueueMetrics>
}
