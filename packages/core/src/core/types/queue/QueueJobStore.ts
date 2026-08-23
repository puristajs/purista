import { createStateStoreRetentionView } from '../../StateStore/createStateStoreRetentionView.impl.js'
import type { StateStore } from '../../StateStore/types/StateStore.js'
import type { QueueResultStatus } from './QueueResultPolicy.js'

export type QueueJobStatusRecord = {
	jobId: string
	queueName: string
	status: QueueResultStatus
	attempt: number
	createdAt?: number
	leasedAt?: number
	updatedAt: number
	completedAt?: number
	failedAt?: number
	cancelledAt?: number
	progress?: unknown
	result?: unknown
	error?: unknown
	traceId?: string
	correlationId?: string
	tenantId?: string
	principalId?: string
	runId?: string
}

export type QueueJobStore = {
	get(jobId: string): Promise<QueueJobStatusRecord | undefined>
	set(record: QueueJobStatusRecord, ttlMs?: number): Promise<void>
}

/**
 * Create a small queue job store backed by PURISTA's StateStore.
 *
 * @example
 * ```ts
 * const jobStore = createStateStoreQueueJobStore(stateStore)
 * ```
 */
export const createStateStoreQueueJobStore = (stateStore: StateStore, prefix = 'purista:queue-job'): QueueJobStore => {
	const retainedStore = createStateStoreRetentionView(stateStore)

	return {
		async get(jobId) {
			const key = `${prefix}:${jobId}`
			const result = await retainedStore.getState(key)
			return result[key] as QueueJobStatusRecord | undefined
		},
		async set(record, ttlMs) {
			await retainedStore.setState(
				`${prefix}:${record.jobId}`,
				record,
				ttlMs === undefined ? undefined : { retention: { mode: 'expire', ttlMs } },
			)
		},
	}
}
