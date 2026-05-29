/**
 * Metadata returned after a message has been accepted for queue delivery.
 *
 * With strict idempotency-capable adapters, duplicate enqueue attempts may
 * return the original `jobId` for the same idempotency key.
 *
 * @group Queue bridge
 */
export type QueueEnqueueResult = {
	/** Provider or adapter job identifier. */
	jobId: string
	/** Queue that accepted the job. */
	queueName: string
	/** Epoch milliseconds when the job is scheduled to become visible. */
	scheduledAt?: number
}
