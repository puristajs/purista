import { randomUUID } from 'node:crypto'
import type { TransactionRepository } from '../service/transaction/v1/TransactionRepository.js'
import type { CreateTransaction, Transaction } from '../service/transaction/v1/transaction.js'

export class InMemoryTransactionRepository implements TransactionRepository {
	readonly #records = new Map<string, Transaction>()

	async save(input: CreateTransaction) {
		const transaction: Transaction = {
			...input,
			transactionId: randomUUID(),
			recordedAt: new Date().toISOString(),
		}
		this.#records.set(transaction.transactionId, transaction)
		return transaction
	}

	async findById(transactionId: string) {
		return this.#records.get(transactionId)
	}
}
