export type QueueExecutionProfileName = 'longRunning'

export type QueueLongRunningExecutionProfile = {
	name: QueueExecutionProfileName
	maxRuntimeMs: number
	strict?: boolean
	shutdown?: {
		graceMs?: number
		onTimeout?: 'letLeaseExpire'
	}
	onLeaseLost?: 'abort'
}
