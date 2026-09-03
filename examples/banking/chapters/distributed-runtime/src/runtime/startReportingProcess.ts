import type { EventBridge, Logger, QueueBridge, QueueJobStore, StateStore } from '@purista/core'
import { reportingV1Service } from '../service/reporting/v1/reportingV1Service.js'
import { destroyInOrder, type ProcessRuntime } from './ProcessRuntime.js'

export async function startReportingProcess(
	logger: Logger,
	eventBridge: EventBridge,
	queueBridge: QueueBridge,
	stateStore: StateStore,
	queueJobStore: QueueJobStore,
): Promise<ProcessRuntime> {
	const service = await reportingV1Service.getInstance(eventBridge, {
		logger, queueBridge, stateStore, queueJobStore,
	})
	await service.start()
	return {
		role: 'reporting', service, eventBridge,
		destroy: () => destroyInOrder([service, stateStore, eventBridge]),
	}
}
