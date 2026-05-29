/**
 * Retry request returned to a queue bridge when work should run again.
 *
 * Keep `reason` safe for logs and dead-letter headers. Do not include raw
 * payloads, secrets, PII, prompts, tokens, or provider credentials.
 *
 * @group Queue bridge
 */
export type QueueRetryRequest = {
	/** Safe, low-detail reason for retry diagnostics. */
	reason?: string
	/** Delay before the message is visible for another attempt. */
	delayMs?: number
}
