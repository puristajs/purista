import type { Prettify } from '@purista/core'
import type { ConnectionOptions } from 'nats'

/**
 * Default JetStream-backed subscription failure handling.
 */
export type NatsConsumerFailureHandlingDefaults = {
	/** Maximum delivery attempts before the message is dead-lettered. */
	maxAttempts: number
	/** Delay in milliseconds before JetStream redelivers a failed message. */
	retryDelayMs: number
	/** Suffix appended to the source subject for the default dead-letter subject. */
	deadLetterSuffix: string
}
/**
 * Configuration for {@link NatsBridge}.
 *
 * Extends NATS connection options. Durable and manual-ack behavior requires
 * JetStream. `durableSubscriptionMode: 'strict'` fails registrations when
 * JetStream is unavailable; `'best-effort'` logs a warning and uses core NATS
 * semantics without durability, retry, or DLQ guarantees.
 */
export type NatsBridgeConfig = Prettify<
	{
		/**
		 * the prefix for topic to prevent name collisions
		 *
		 * @default purista
		 */
		topicPrefix: string

		/**
		 * The string which should be used in topics for parts, which are undefined
		 *
		 * @default __none__
		 */
		emptyTopicPartString: string

		/**
		 * Indicates if a command response should be published a second time.
		 * If the command response gets published, it will be published to the regular topic pattern.
		 *
		 * If set to `never`, subscription might not get messages they are expecting because of the timing.
		 *
		 * If set to `always`, every command response is published.
		 * Because there might not be a consumer for every message, the broker will store the messages until the `defaultMessageExpiryInterval` is reached.
		 * This might result in a high resource consumption of the broker.
		 *
		 * If set to `eventOnly`, only success responses which have a event name set, are published twice.
		 * There, we expect, that an event has at least one consumer subscription and the broker does not unnecessarily stores messages for a long time.
		 *
		 * @default eventOnly
		 */
		commandResponsePublishTwice: 'always' | 'eventOnly' | 'eventAndError' | 'never'

		/**
		 * the message expiry interval in seconds
		 *
		 * @default 30 days in seconds
		 */
		defaultMessageExpiryInterval: number

		/**
		 * maximum messages to run in parallel per subscription
		 * 10 means, each subscription can handle 10 calls at the same time
		 *
		 * @default 10
		 */
		maxMessages: number

		/**
		 * JetStream consumer ack wait in milliseconds for command and subscription consumers.
		 * This is a broker-level processing timeout used for redelivery when no ack/nak/term is sent.
		 *
		 * @default 30000
		 */
		jetStreamAckWaitMs: number

		/**
		 * Controls how durable registrations behave when JetStream durability is not implemented.
		 *
		 * Use `strict` for production guarantees. Use `best-effort` only when
		 * startup should continue without durable delivery guarantees.
		 *
		 * @default strict
		 */
		durableSubscriptionMode: 'strict' | 'best-effort'

		/**
		 * Default failure handling for JetStream-backed subscription consumers.
		 * Per-subscription consumer failure handling hints override these values.
		 */
		defaultConsumerFailureHandling: NatsConsumerFailureHandlingDefaults
	} & ConnectionOptions
>
