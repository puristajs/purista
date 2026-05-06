export type QueueResultPolicyMode = 'none' | 'event' | 'state' | 'state-and-event'
export type QueueResultPolicyDelivery = 'required' | 'best-effort'
export type QueueResultStatus = 'success' | 'failed' | 'cancelled' | 'dead-lettered' | 'progress'

export type QueueResultEventIdStrategy =
	| 'jobIdAndStatus'
	| ((input: { jobId: string; queueName: string; status: QueueResultStatus; attempt: number }) => string)

export type QueueResultPolicy = {
	mode: QueueResultPolicyMode
	successEventName?: string
	failureEventName?: string
	cancelledEventName?: string
	deadLetterEventName?: string
	progressEventName?: string
	ttlMs?: number
	emitProgressEvents?: boolean
	eventId?: QueueResultEventIdStrategy
	delivery?: QueueResultPolicyDelivery
}

export type QueueResultEventPayload = {
	jobId: string
	queueName: string
	status: QueueResultStatus
	attempt: number
	payload?: unknown
	headers?: Record<string, string>
	traceId?: string
	correlationId?: string
	tenantId?: string
	principalId?: string
	runId?: string
}
