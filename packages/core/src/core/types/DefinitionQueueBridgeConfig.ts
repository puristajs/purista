export type QueueOrderingGuarantee = 'none' | 'fifo' | 'partition'

/**
 * Queue bridge delivery requirements requested by the service definition.
 * In strict mode, startup validation rejects queues when a bridge cannot
 * satisfy these settings with its declared capabilities.
 */
export type DefinitionQueueBridgeConfig = {
	/**
	 * Whether jobs must be processed in strict FIFO order, partitioned order (per key),
	 * or if the provider can deliver them without ordering guarantees.
	 */
	orderingGuarantee: QueueOrderingGuarantee
	/**
	 * Desired number of jobs a worker should prefetch/lease at once.
	 */
	prefetch: number
}
