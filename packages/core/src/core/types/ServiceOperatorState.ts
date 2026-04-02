export type InFlightExecutionCounts = Record<'command' | 'subscription' | 'stream' | 'generic', number>

export type InFlightDiagnostics = {
	total: number
	byKind: InFlightExecutionCounts
}

export type PausedQueueWorkerState = {
	pausedAt: number
	reason: string
}

export type PausedSubscriptionConsumerState = {
	pausedAt: number
	reason: string
}

export type QueueWorkerPauseStateByQueue = Record<string, PausedQueueWorkerState>
export type PausedSubscriptionConsumersByRegistrationKey = Record<string, PausedSubscriptionConsumerState>

export type QueueWorkerPauseHealthState = PausedQueueWorkerState & {
	queueName: string
}

export type PausedSubscriptionConsumerHealthState = PausedSubscriptionConsumerState & {
	registrationKey: string
}
