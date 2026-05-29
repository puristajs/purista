/**
 * Queue operational metrics returned by a bridge.
 *
 * Values should be aggregate counts only. Do not expose payload contents or
 * high-cardinality job identifiers through metrics.
 *
 * @group Queue
 */
export type QueueMetrics = {
	/** Number of jobs waiting to be leased. */
	pending: number
	/** Number of jobs currently leased by workers. */
	inflight: number
	/** Number of jobs in dead-letter storage. */
	deadLetter: number
	/** Number of retry operations observed by the bridge. */
	retries: number
	/** Age in milliseconds of the oldest pending job, when available. */
	oldestAgeMs?: number
}
