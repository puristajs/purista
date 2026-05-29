/**
 * Diagnostic view of an active queue lease.
 *
 * @group Queue bridge
 */
export type QueueLeaseInspectionRecord = {
	/** Provider or adapter lease identifier. */
	leaseId: string
	/** Queue that owns the lease. */
	queueName: string
	/** Job currently protected by the lease. */
	jobId: string
	/** Epoch milliseconds when the lease was acquired. */
	leasedAt?: number
	/** Epoch milliseconds when the lease expires. */
	leaseExpiresAt: number
}
