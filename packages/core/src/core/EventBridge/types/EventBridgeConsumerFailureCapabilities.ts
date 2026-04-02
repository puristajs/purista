export type EventBridgeConsumerFailureCapabilities = {
	boundedRetry: boolean
	delayedRetry: boolean
	deadLetterTarget: boolean
	bridgeManagedDeadLettering: boolean
	nativeDeadLettering: boolean
	fatalClassification: boolean
	strictMode: boolean
}
