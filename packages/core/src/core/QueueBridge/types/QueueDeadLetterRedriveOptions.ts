/**
 * Options for moving dead-letter messages back to the live queue.
 *
 * @group Queue bridge
 */
export type QueueDeadLetterRedriveOptions = {
	/** Maximum number of messages to redrive. */
	limit?: number
	/** Optional delay before replayed messages become available. */
	delayMs?: number
}
