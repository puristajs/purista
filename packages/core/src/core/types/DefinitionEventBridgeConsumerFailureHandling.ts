/**
 * Advisory failure handling for broker-backed consumers such as subscriptions.
 *
 * Event bridge implementations may honor all, some, or none of these fields
 * depending on their transport capabilities. Use bridge capabilities and
 * transport-specific documentation to understand the effective behavior.
 */
export type DefinitionEventBridgeConsumerFailureHandling = {
	/**
	 * Maximum number of delivery attempts including the initial delivery.
	 *
	 * If omitted, the adapter default applies. If the adapter has no default,
	 * the broker may retry indefinitely.
	 */
	maxAttempts?: number
	/**
	 * Delay in milliseconds before a failed message is redelivered.
	 *
	 * Adapters that cannot schedule delayed redelivery may ignore this value.
	 */
	retryDelayMs?: number
	/**
	 * Logical dead-letter target to use when the retry budget is exhausted.
	 *
	 * The meaning depends on the adapter:
	 * - NATS: subject
	 * - AMQP: queue / routing target via broker configuration
	 * - other adapters: documented transport-specific equivalent
	 */
	deadLetterTarget?: string
}
