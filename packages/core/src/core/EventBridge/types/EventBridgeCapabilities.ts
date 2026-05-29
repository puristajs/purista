import type { EventBridgeCommandCapabilities } from './EventBridgeCommandCapabilities.js'
import type { EventBridgeConsumerFailureCapabilities } from './EventBridgeConsumerFailureCapabilities.js'
import type { EventBridgeLateResponseHandling } from './EventBridgeLateResponseHandling.js'
import type { EventBridgeStreamCapabilities } from './EventBridgeStreamCapabilities.js'

/**
 * Capability matrix reported by an {@link EventBridge}.
 *
 * These flags must reflect real adapter guarantees. PURISTA uses them to
 * validate command, stream, and subscription reliability requirements at
 * startup instead of silently accepting unsupported production semantics.
 *
 * @group Event bridge
 */
export type EventBridgeCapabilities = {
	/** Supports stream open requests and incremental frames. */
	supportsStreams: boolean
	/** Command messages survive process restarts/provider reconnects. */
	durableCommands: boolean
	/** Subscription deliveries survive process restarts/provider reconnects. */
	durableSubscriptions: boolean
	/** Consumers can explicitly acknowledge or reject deliveries. */
	manualAckSupported: boolean
	/** Policy for responses that arrive after caller timeout. */
	lateResponseHandling: EventBridgeLateResponseHandling
	/** Supports graceful drain while shutting down. */
	gracefulDrainSupported: boolean
	/** Provider has native dead-letter handling. */
	nativeDeadLettering: boolean
	/** Command transport capability details. */
	commandHandling: EventBridgeCommandCapabilities
	/** Stream transport capability details. */
	streamHandling: EventBridgeStreamCapabilities
	/** Subscription consumer failure capability details. */
	consumerFailureHandling: EventBridgeConsumerFailureCapabilities
}
