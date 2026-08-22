import type { QueueRetryRequest } from '../../QueueBridge/types/QueueRetryRequest.js'

/**
 * Idempotency requirement for event-to-queue bindings.
 *
 * `strict` requires a queue bridge that enforces idempotency keys and should
 * fail startup when the selected bridge cannot honor that guarantee.
 *
 * @group Queue
 */
export type EventToQueueIdempotencyMode = 'advisory' | 'strict'

/**
 * Strategy used to derive an idempotency key from the source message.
 *
 * Custom functions should return a stable, non-sensitive key. Do not include
 * payloads, secrets, PII, tokens, or headers in the returned value.
 *
 * @group Queue
 */
export type EventToQueueIdempotencyStrategy =
	| 'messageId'
	| 'correlationId'
	| 'eventField'
	| 'none'
	| ((message: any) => string | undefined)

/**
 * Binds an emitted event to a queue enqueue operation.
 *
 * This converts event reactions into durable retryable work while keeping
 * event delivery and queue delivery semantics separate.
 *
 * @group Queue
 */
export type EventToQueueBindingDefinition = {
	/** Event name to consume. */
	eventName: string
	/** Queue that receives the derived job. */
	queueName: string
	/** Whether idempotency is advisory or strictly required. */
	idempotencyMode: EventToQueueIdempotencyMode
	/** Strategy used to produce the enqueue idempotency key. */
	idempotencyKey?: EventToQueueIdempotencyStrategy
	/** Optional mapper for the queue payload. */
	mapPayload?: (event: any) => unknown
	/** Optional mapper for queue parameters. */
	mapParameter?: (event: any) => unknown
	/** Retry/fail behavior when enqueueing the queue job fails. */
	onEnqueueFailure?: QueueRetryRequest | { status: 'fail'; reason: string }
}
