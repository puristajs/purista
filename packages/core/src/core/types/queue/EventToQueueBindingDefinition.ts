import type { QueueRetryRequest } from '../../QueueBridge/types/QueueRetryRequest.js'

export type EventToQueueIdempotencyMode = 'advisory' | 'strict'

export type EventToQueueIdempotencyStrategy =
	| 'messageId'
	| 'correlationId'
	| 'eventField'
	| 'none'
	| ((event: any) => string | undefined)

export type EventToQueueBindingDefinition = {
	eventName: string
	queueName: string
	idempotencyMode: EventToQueueIdempotencyMode
	idempotencyKey?: EventToQueueIdempotencyStrategy
	mapPayload?: (event: any) => unknown
	mapParameter?: (event: any) => unknown
	onEnqueueFailure?: QueueRetryRequest | { status: 'fail'; reason: string }
}
