export type EventBridgeConsumerFailureCapabilities = {
	boundedRetry: boolean
	delayedRetry: boolean
	deadLetterTarget: boolean
	drop: boolean
	stopConsumer: boolean
	consumerPauseResume: boolean
	bridgeManagedDeadLettering: boolean
	nativeDeadLettering: boolean
	fatalClassification: boolean
	strictMode: boolean
}
