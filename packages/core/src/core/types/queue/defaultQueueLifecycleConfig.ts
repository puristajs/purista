import type { QueueLifecycleConfig } from './QueueLifecycleConfig.js'

/**
 * Opinionated defaults for queues so builders can omit lifecycle overrides
 * yet still get resilient behaviour.
 */
export const defaultQueueLifecycleConfig: QueueLifecycleConfig = {
	visibilityTimeoutMs: 15 * 60 * 1000, // 15 minutes
	maxLeaseExtensions: 3,
	heartbeatIntervalMs: 5 * 60 * 1000, // 5 minutes
	retryWindowMs: 24 * 60 * 60 * 1000, // 24 hours
	autoHeartbeat: true,
	maxAttempts: 10,
	poisonMessageFailureThreshold: 0,
	poisonMessageAction: 'none',
	retryStrategy: {
		initialDelayMs: 1_000,
		maxDelayMs: 120_000,
		multiplier: 2,
		jitterFactor: 0.25,
	},
}
