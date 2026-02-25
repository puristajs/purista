export type QueueMetrics = {
	pending: number
	inflight: number
	deadLetter: number
	retries: number
	oldestAgeMs?: number
}
