import type { EventBridgeStreamLateFrameHandling } from './EventBridgeStreamLateFrameHandling.js'

export type EventBridgeStreamCapabilities = {
	incrementalDelivery: boolean
	consumerCancellation: boolean
	gracefulStreamDrain: boolean
	aggregatedFinalSupported: boolean
	lateFrameHandling: EventBridgeStreamLateFrameHandling
}
