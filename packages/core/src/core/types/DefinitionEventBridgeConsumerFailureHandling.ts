export type DefinitionEventBridgeConsumerFailureMode = 'strict' | 'best-effort'

/**
 * Advisory failure handling for broker-backed consumers such as subscriptions.
 *
 * The selected event bridge must validate this request against its capabilities.
 * In `strict` mode the bridge must fail startup if it cannot honor the requested
 * semantics. In `best-effort` mode the bridge may degrade behavior but must log
 * the degradation explicitly.
 */
export type DefinitionEventBridgeConsumerFailureHandling = {
	/**
	 * Controls whether unsupported semantics fail startup or degrade explicitly.
	 *
	 * @default strict
	 */
	mode?: DefinitionEventBridgeConsumerFailureMode
	/**
	 * Maximum number of delivery attempts including the initial delivery.
	 *
	 * If omitted, the adapter default applies.
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
	/**
	 * Exhausted messages are dead-lettered. Adapters must either honor this
	 * behavior or reject the registration in `strict` mode.
	 */
}
