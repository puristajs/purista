import type { EventBridge, Logger, StateStore } from '@purista/core'
import { monitoringV1Service } from '../service/monitoring/v1/monitoringV1Service.js'
import { destroyInOrder, type ProcessRuntime } from './ProcessRuntime.js'

export async function startMonitoringProcess(
	logger: Logger,
	eventBridge: EventBridge,
	stateStore: StateStore,
	serviceDefinition: typeof monitoringV1Service = monitoringV1Service,
): Promise<ProcessRuntime> {
	const service = await serviceDefinition.getInstance(eventBridge, { logger, stateStore })
	await service.start()
	return {
		role: 'monitoring', service, eventBridge,
		destroy: () => destroyInOrder([service, stateStore, eventBridge]),
	}
}
