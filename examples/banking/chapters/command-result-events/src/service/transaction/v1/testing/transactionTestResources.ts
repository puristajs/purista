import { localAccountAccessPolicy } from '../AccountAccessPolicy.js'
import type { LegacyTransactionClient } from '../LegacyTransactionClient.js'
import type { TransactionRepository } from '../TransactionRepository.js'
import { unavailableLegacyTransactionClient } from './unavailableLegacyTransactionClient.js'

export function transactionTestResources(
	transactionRepository: TransactionRepository,
	legacyTransactionClient: LegacyTransactionClient = unavailableLegacyTransactionClient,
) {
	return {
		transactionRepository,
		accountAccessPolicy: localAccountAccessPolicy,
		legacyTransactionClient,
	}
}
