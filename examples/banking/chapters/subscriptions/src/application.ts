import { initDefaultStateStore, type Logger, type StateStore } from '@purista/core'
import { getEventBridge } from './eventbridge.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'
import { monitoringV1Service } from './service/monitoring/v1/monitoringV1Service.js'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'

export async function createApplication(
	logger: Logger,
	transactionRepository = new SqliteTransactionRepository(':memory:'),
	monitoringStateStore: StateStore = initDefaultStateStore({ logger }),
) {
	const eventBridge = await getEventBridge(logger)
	const transaction = await transactionV1Service.getInstance(eventBridge, {
		logger,
		resources: { transactionRepository },
	})
	const monitoring = await monitoringV1Service.getInstance(eventBridge, {
		logger,
		stateStore: monitoringStateStore,
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
