export type QueueEnqueueOptions<Payload, Params> = {
	queueName: string
	payload: Payload
	parameter?: Params
	delayMs?: number
	idempotencyKey?: string
	headers?: Record<string, string>
	maxAttempts?: number
	priority?: number
	leaseTtlMs?: number
}
