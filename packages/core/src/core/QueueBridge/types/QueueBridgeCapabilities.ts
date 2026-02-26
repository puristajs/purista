export type QueueBridgeCapabilities = {
	delayedDelivery: boolean
	fifoOrdering: boolean
	partitions: boolean
	priorities: boolean
	deadLetterNative: boolean
	exactlyOnce: boolean
	maxBatchSize: number
	defaultDeadLetterPrefix?: string
	defaultDeadLetterSuffix?: string
	deadLetterInspectable: boolean
}
