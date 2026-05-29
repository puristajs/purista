/**
 * Options passed to a queue bridge when enqueueing work.
 *
 * Headers and idempotency keys may be stored by external providers. Keep them
 * low-cardinality and non-sensitive.
 *
 * @group Queue
 */
export type QueueEnqueueOptions<Payload, Params> = {
	/** Queue that should receive the job. */
	queueName: string
	/** Payload validated against the queue payload schema before enqueue. */
	payload: Payload
	/** Optional parameters validated against the queue parameter schema. */
	parameter?: Params
	/** Delay in milliseconds before the job becomes available. */
	delayMs?: number
	/** Stable deduplication key when the bridge supports idempotency. */
	idempotencyKey?: string
	/** Safe transport metadata. Do not store secrets or raw request headers. */
	headers?: Record<string, string>
	/** Maximum processing attempts before dead-letter handling. */
	maxAttempts?: number
	/** Adapter-specific priority value when priorities are supported. */
	priority?: number
	/** Initial lease time-to-live in milliseconds. */
	leaseTtlMs?: number
}
