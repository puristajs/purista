import type { StoreTransaction, Transaction } from './transaction.js'

export interface TransactionRepository {
	save(input: StoreTransaction): Promise<Transaction>
	findById(transactionId: string): Promise<Transaction | undefined>
}
