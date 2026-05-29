/**
 * Named execution profile for queue workers.
 *
 * @group Queue
 */
export type QueueExecutionProfileName = 'longRunning'

/**
 * Runtime policy for work that may exceed a normal lease interval.
 *
 * Use this for handlers that need heartbeat and cancellation semantics. Strict
 * profiles should fail startup when the queue bridge cannot support the
 * required lease behavior.
 *
 * @group Queue
 */
export type QueueLongRunningExecutionProfile = {
	/** Profile name. */
	name: QueueExecutionProfileName
	/** Expected upper runtime bound in milliseconds. */
	maxRuntimeMs: number
	/** Require bridge support instead of best-effort local handling. */
	strict?: boolean
	/** Shutdown behavior for in-flight work. */
	shutdown?: {
		/** Grace period before timeout behavior is applied. */
		graceMs?: number
		/** Allow the provider lease to expire when shutdown grace is exceeded. */
		onTimeout?: 'letLeaseExpire'
	}
	/** Abort the handler signal when lease ownership is lost. */
	onLeaseLost?: 'abort'
}
