/**
 * Exponential backoff settings for queue retries.
 *
 * @group Queue
 */
export type QueueRetryStrategy = {
	/** Initial retry delay in milliseconds. */
	initialDelayMs: number
	/** Maximum retry delay in milliseconds. */
	maxDelayMs: number
	/** Multiplier applied to each retry delay. */
	multiplier: number
	/** Randomization factor used to reduce retry bursts. */
	jitterFactor: number
}
