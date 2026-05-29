/**
 * Subscription consumer failure capabilities for an event bridge.
 *
 * @group Event bridge
 */
export type EventBridgeConsumerFailureCapabilities = {
	/** Supports bounded retry attempts. */
	boundedRetry: boolean
	/** Supports delayed retry between attempts. */
	delayedRetry: boolean
	/** Supports routing failed deliveries to a dead-letter target. */
	deadLetterTarget: boolean
	/** Supports intentionally dropping failed deliveries. */
	drop: boolean
	/** Supports stopping a consumer after failure thresholds. */
	stopConsumer: boolean
	/** Supports pausing and resuming individual consumers. */
	consumerPauseResume: boolean
	/** Bridge can manage dead-letter routing itself. */
	bridgeManagedDeadLettering: boolean
	/** Provider has native dead-lettering. */
	nativeDeadLettering: boolean
	/** Supports fatal/non-fatal failure classification. */
	fatalClassification: boolean
	/** Bridge supports strict consumer failure validation. */
	strictMode: boolean
}
