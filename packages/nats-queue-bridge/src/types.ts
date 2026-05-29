import type { ConnectionOptions } from 'nats'

/**
 * Configuration for {@link NatsQueueBridge}.
 *
 * Requires a NATS server with JetStream enabled. Queue payloads, parameters,
 * and headers are serialized with NATS `JSONCodec`, so callers should avoid
 * placing secrets or unnecessary personal data in queue messages unless their
 * deployment encrypts and protects the broker storage.
 *
 * @example
 * ```typescript
 * import { NatsQueueBridge } from '@purista/nats-queue-bridge'
 *
 * const queueBridge = new NatsQueueBridge({
 *   connectionOptions: { servers: 'nats://localhost:4222' },
 *   subjectPrefix: 'acme.queue',
 * })
 * await queueBridge.start()
 * ```
 */
export type NatsQueueBridgeOptions = {
	/** NATS connection options passed to `nats.connect`. */
	connectionOptions?: ConnectionOptions
	/** Subject prefix used for all queue, schedule, DLQ, and idempotency subjects. */
	subjectPrefix?: string
	/** Default lease duration for leased jobs in milliseconds. */
	defaultLeaseTtlMs?: number
	/** Default maximum attempts before a job is moved to the dead-letter stream. */
	defaultMaxAttempts?: number
	/** JetStream storage type for streams created by this bridge. Defaults to file storage. */
	storageType?: 'file' | 'memory'
	/** Maximum scheduled jobs released to the pending stream in one pass. */
	releaseBatchSize?: number
	/** Time to wait for an in-flight idempotent publish record before treating it as stale. */
	idempotencyPendingTimeoutMs?: number
}
