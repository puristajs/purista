import type { CreateTransaction, Transaction } from './transaction.js'

export interface TransactionRepository {
	save(input: CreateTransaction): Promise<Transaction>
	findById(transactionId: string): Promise<Transaction | undefined>
}
