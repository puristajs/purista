import { randomUUID } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import type { RecordedTransaction, TransactionInput } from './transaction.js'

/** Process-local storage. Each new instance starts empty. */
export class TransactionRepository {
	private readonly transactions = new Map<string, RecordedTransaction>()

	/** Reject a duplicate source record instead of storing it twice. */
	record(input: TransactionInput): RecordedTransaction {
		const key = `${input.accountId}:${input.sourceTransactionId}`
		if (this.transactions.has(key)) {
			throw new HandledError(StatusCode.Conflict, 'This source transaction is already recorded')
		}
		const transaction = { ...input, transactionId: randomUUID() }
		this.transactions.set(key, transaction)
		return { ...transaction }
	}

	/** Return copies so callers cannot change stored records by modifying a response. */
	list(accountId: TransactionInput['accountId']): RecordedTransaction[] {
		return [...this.transactions.values()]
			.filter(transaction => transaction.accountId === accountId)
			.map(transaction => ({ ...transaction }))
	}
}
