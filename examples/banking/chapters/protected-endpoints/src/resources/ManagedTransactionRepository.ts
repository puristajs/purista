import type { TransactionRepository } from '../service/transaction/v1/TransactionRepository.js'

export interface ManagedTransactionRepository extends TransactionRepository {
	readonly name: 'sqliteTransactionRepository'
	destroy(): Promise<void>
}
