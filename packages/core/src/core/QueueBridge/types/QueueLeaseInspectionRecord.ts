export type QueueLeaseInspectionRecord = {
	leaseId: string
	queueName: string
	jobId: string
	leasedAt?: number
	leaseExpiresAt: number
}
