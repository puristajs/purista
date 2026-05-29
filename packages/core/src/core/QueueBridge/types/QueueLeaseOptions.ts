/**
 * Options used when leasing work from a queue.
 *
 * @group Queue bridge
 */
export type QueueLeaseOptions = {
	/** Requested number of messages; adapters may cap this by capability. */
	batchSize?: number
	/** Optional long-poll wait time in milliseconds. */
	waitTimeMs?: number
}
