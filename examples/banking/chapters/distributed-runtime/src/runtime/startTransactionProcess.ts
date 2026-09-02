import type { EventBridge, Logger } from '@purista/core'
import { SqliteTransactionRepository } from '../resources/SqliteTransactionRepository.js'
import { transactionV1Service } from '../service/transaction/v1/transactionV1Service.js'
import { destroyInOrder, type ProcessRuntime } from './ProcessRuntime.js'

export async function startTransactionProcess(
	logger: Logger,
	eventBridge: EventBridge,
	repository = new SqliteTransactionRepository(':memory:'),
): Promise<ProcessRuntime> {
	const service = await transactionV1Service.getInstance(eventBridge, {
		logger,
		resources: { transactionRepository: repository },
	})
	await service.start()
	return {
		role: 'transaction', service, eventBridge,
		destroy: () => destroyInOrder([service, repository, eventBridge]),
	}
}
