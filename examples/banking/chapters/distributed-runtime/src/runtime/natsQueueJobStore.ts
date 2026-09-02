import type { QueueJobStatusRecord, QueueJobStore, StateStore } from '@purista/core'

export function createNatsQueueJobStore(
	stateStore: StateStore,
	prefix = 'reporting-job',
): QueueJobStore {
	const key = (jobId: string) => `${prefix}/${jobId}`
	return {
		async get(jobId) {
			const stateKey = key(jobId)
			const result = await stateStore.getState(stateKey)
			return result[stateKey] as QueueJobStatusRecord | undefined
		},
		async set(record) {
			await stateStore.setState(key(record.jobId), record)
		},
	}
}
