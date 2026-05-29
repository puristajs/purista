import type { QueueRetryStrategy } from './QueueRetryStrategy.js'

/**
 * Queue retry, leasing, heartbeat, and poison-message policy.
 *
 * These values define runtime reliability semantics. Strict production queues
 * should be paired with a bridge whose capabilities can enforce the requested
 * behavior instead of relying on local best-effort behavior.
 *
 * @group Queue
 */
export type QueueLifecycleConfig = {
	/** Initial visibility timeout/lease duration in milliseconds. */
	visibilityTimeoutMs: number
	/** Maximum number of lease extensions for one attempt. */
	maxLeaseExtensions: number
	/** Heartbeat interval used when auto-heartbeat is enabled. */
	heartbeatIntervalMs: number
	/** Time window in milliseconds during which retries may continue. */
	retryWindowMs: number
	/** Automatically extend leases while handlers are still running. */
	autoHeartbeat: boolean
	/** Maximum attempts before dead-letter or failure policy. */
	maxAttempts: number
	/** Backoff policy used for retry delays. */
	retryStrategy: QueueRetryStrategy
	/** Consecutive poison-message failures before action is applied. */
	poisonMessageFailureThreshold: number
	/** Action to take when the poison-message threshold is exceeded. */
	poisonMessageAction: 'none' | 'pause-worker'
}
