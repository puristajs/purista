import type { EventBridgeStreamLateFrameHandling } from './EventBridgeStreamLateFrameHandling.js'

/**
 * Stream transport capabilities for an event bridge.
 *
 * @group Event bridge
 */
export type EventBridgeStreamCapabilities = {
	/** Delivers frames incrementally instead of only as an aggregate final value. */
	incrementalDelivery: boolean
	/** Supports caller-driven stream cancellation. */
	consumerCancellation: boolean
	/** Supports draining active streams during shutdown. */
	gracefulStreamDrain: boolean
	/** Can deliver a final aggregate result frame. */
	aggregatedFinalSupported: boolean
	/** Policy for frames that arrive after stream timeout. */
	lateFrameHandling: EventBridgeStreamLateFrameHandling
}
