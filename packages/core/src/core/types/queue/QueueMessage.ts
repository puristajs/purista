/**
 * Provider-neutral queue message shape used by bridges and workers.
 *
 * Payload and parameters are schema-validated by the service runtime before
 * enqueue or execution when schemas are declared. Transport metadata should be
 * treated as observable; avoid secrets, PII, raw headers, prompts, and tokens.
 *
 * @group Queue
 */
export type QueueMessage<Payload = unknown, Params = unknown> = {
	/** Provider or adapter job id. */
	id: string
	/** Queue that owns the message. */
	queueName: string
	/** Business payload. */
	payload: Payload
	/** Optional business parameters. */
	parameter?: Params
	/** Safe queue metadata propagated with the message. */
	headers: Record<string, string>
	/** Epoch milliseconds when the message was created. */
	createdAt: number
	/** Epoch milliseconds when the message becomes visible. */
	scheduledAt?: number
	/** Adapter-specific priority value. */
	priority?: number
	/** Current processing attempt count. */
	attempt: number
	/** Maximum attempts before dead-letter policy. */
	maxAttempts: number
	/** Epoch milliseconds when the active lease expires. */
	leaseExpiresAt: number
	/** Lease duration in milliseconds. */
	leaseTtlMs: number
	/** Trace id propagated from the source operation. */
	traceId?: string
	/** Parent span id for telemetry correlation. */
	parentSpanId?: string
	/** Correlation id propagated from the source operation. */
	correlationId?: string
	/** Stable deduplication key when bridge idempotency is enabled. */
	idempotencyKey?: string
}
