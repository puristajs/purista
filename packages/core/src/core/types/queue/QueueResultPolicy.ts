/**
 * Queue result publication mode.
 *
 * @group Queue
 */
export type QueueResultPolicyMode = 'none' | 'event' | 'state' | 'state-and-event'
/** Delivery requirement for queue result publication. */
export type QueueResultPolicyDelivery = 'required' | 'best-effort'
/** Canonical queue result status values. */
export type QueueResultStatus = 'success' | 'failed' | 'cancelled' | 'dead-lettered' | 'progress'

/**
 * Strategy used to generate result event ids.
 *
 * Custom functions must return stable, non-sensitive identifiers.
 *
 * @group Queue
 */
export type QueueResultEventIdStrategy =
	| 'jobIdAndStatus'
	| ((input: { jobId: string; queueName: string; status: QueueResultStatus; attempt: number }) => string)

/**
 * Controls how queue worker outcomes are persisted or emitted.
 *
 * Result payloads and headers can become events or state records. Keep them
 * intentionally small and free of secrets, PII, raw prompts, tokens, and large
 * provider responses.
 *
 * @group Queue
 */
export type QueueResultPolicy = {
	/** Publication mode for worker results. */
	mode: QueueResultPolicyMode
	/** Event name used for successful results. */
	successEventName?: string
	/** Event name used for failed results. */
	failureEventName?: string
	/** Event name used for cancellation results. */
	cancelledEventName?: string
	/** Event name used when a job is dead-lettered. */
	deadLetterEventName?: string
	/** Event name used for progress results. */
	progressEventName?: string
	/** Optional state retention hint in milliseconds. */
	ttlMs?: number
	/** Emit progress updates as events. */
	emitProgressEvents?: boolean
	/** Event id strategy for result event idempotency. */
	eventId?: QueueResultEventIdStrategy
	/** Whether result publication is required or best-effort. */
	delivery?: QueueResultPolicyDelivery
}

/**
 * Payload emitted for queue result events.
 *
 * @group Queue
 */
export type QueueResultEventPayload = {
	jobId: string
	queueName: string
	status: QueueResultStatus
	attempt: number
	payload?: unknown
	headers?: Record<string, string>
	traceId?: string
	correlationId?: string
	tenantId?: string
	principalId?: string
	runId?: string
}
