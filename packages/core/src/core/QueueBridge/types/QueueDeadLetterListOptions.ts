/**
 * Pagination options for dead-letter and lease inspection APIs.
 *
 * @group Queue bridge
 */
export type QueueDeadLetterListOptions = {
	/** Maximum number of records to return. */
	limit?: number
	/** Number of records to skip before returning results. */
	offset?: number
}
