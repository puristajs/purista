export type QueueRetryStrategy = {
	initialDelayMs: number
	maxDelayMs: number
	multiplier: number
	jitterFactor: number
}
