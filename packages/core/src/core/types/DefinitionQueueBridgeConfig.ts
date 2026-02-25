export type QueueOrderingGuarantee = 'none' | 'fifo' | 'partition'

/**
 * Advisory settings for queue bridges. Similar to `DefinitionEventBridgeConfig`,
 * these values are hints that individual bridge implementations may or may not
 * be able to honor depending on their provider capabilities.
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
	/**
	 * Hint whether multiple service instances share the workload (`true`)
	 * or if every instance should receive a copy (`false`).
	 */
	shared: boolean
	/**
	 * Whether the queue should persist jobs durably when no workers are available.
	 */
	durable: boolean
}
