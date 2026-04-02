import type { QueueRetryStrategy } from './QueueRetryStrategy.js'

export type QueueLifecycleConfig = {
	visibilityTimeoutMs: number
	maxLeaseExtensions: number
	heartbeatIntervalMs: number
	retryWindowMs: number
	autoHeartbeat: boolean
	maxAttempts: number
	retryStrategy: QueueRetryStrategy
	poisonMessageFailureThreshold: number
	poisonMessageAction: 'none' | 'pause-worker'
}
