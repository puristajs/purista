import { initDefaultStateStore, type Logger, type StateStore } from '@purista/core'
import { getEventBridge } from './eventbridge.js'
import type { ApplicationTelemetry } from './observability/ApplicationTelemetry.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'
import { monitoringV1Service } from './service/monitoring/v1/monitoringV1Service.js'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'

export async function createApplication(
	logger: Logger,
	transactionRepository = new SqliteTransactionRepository(':memory:'),
	monitoringStateStore: StateStore = initDefaultStateStore({ logger }),
	telemetry?: ApplicationTelemetry,
) {
	const eventBridge = await getEventBridge(logger, telemetry)
	const telemetryOptions = telemetry ? {
		spanProcessor: telemetry.spanProcessor,
		metrics: { meter: telemetry.meter },
	} : {}
	const transaction = await transactionV1Service.getInstance(eventBridge, {
		logger,
		resources: { transactionRepository },
		...telemetryOptions,
	})
	const monitoring = await monitoringV1Service.getInstance(eventBridge, {
		logger,
		stateStore: monitoringStateStore,
		...telemetryOptions,
	})

	await transaction.start()
	await monitoring.start()

	return {
		eventBridge,
		transaction,
		transactionRepository,
		monitoring,
		monitoringStateStore,
	}
}
