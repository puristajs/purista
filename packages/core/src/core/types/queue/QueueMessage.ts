export type QueueMessage<Payload = unknown, Params = unknown> = {
	id: string
	queueName: string
	payload: Payload
	parameter?: Params
	headers: Record<string, string>
	createdAt: number
	scheduledAt?: number
	priority?: number
	attempt: number
	maxAttempts: number
	leaseExpiresAt: number
	leaseTtlMs: number
	traceId?: string
	parentSpanId?: string
	correlationId?: string
	idempotencyKey?: string
}
