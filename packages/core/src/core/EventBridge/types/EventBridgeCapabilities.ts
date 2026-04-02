import type { EventBridgeConsumerFailureCapabilities } from './EventBridgeConsumerFailureCapabilities.js'
import type { EventBridgeLateResponseHandling } from './EventBridgeLateResponseHandling.js'

export type EventBridgeCapabilities = {
	supportsStreams: boolean
	durableCommands: boolean
	durableSubscriptions: boolean
	manualAckSupported: boolean
	lateResponseHandling: EventBridgeLateResponseHandling
	gracefulDrainSupported: boolean
	nativeDeadLettering: boolean
	consumerFailureHandling: EventBridgeConsumerFailureCapabilities
}
