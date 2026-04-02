import type { EventBridgeCommandCapabilities } from './EventBridgeCommandCapabilities.js'
import type { EventBridgeConsumerFailureCapabilities } from './EventBridgeConsumerFailureCapabilities.js'
import type { EventBridgeLateResponseHandling } from './EventBridgeLateResponseHandling.js'
import type { EventBridgeStreamCapabilities } from './EventBridgeStreamCapabilities.js'

export type EventBridgeCapabilities = {
	supportsStreams: boolean
	durableCommands: boolean
	durableSubscriptions: boolean
	manualAckSupported: boolean
	lateResponseHandling: EventBridgeLateResponseHandling
	gracefulDrainSupported: boolean
	nativeDeadLettering: boolean
	commandHandling: EventBridgeCommandCapabilities
	streamHandling: EventBridgeStreamCapabilities
	consumerFailureHandling: EventBridgeConsumerFailureCapabilities
}
