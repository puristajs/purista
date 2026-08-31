import { randomUUID } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import type { AccountAccess } from './accountAccess.js'
import type { Identity } from './identity.js'
import type { RecordedTransaction, TransactionInput } from './transaction.js'

/** Process-local storage partitioned by tenant and account. */
export class TransactionRepository {
	private readonly transactions = new Map<string, RecordedTransaction>()

	constructor(private readonly access: AccountAccess) {}

	record(identity: Identity, input: TransactionInput): RecordedTransaction {
		// Recheck current permission immediately before the synchronous mutation.
		this.access.assertAllowed(identity, input.accountId, 'record')
		const key = JSON.stringify([identity.tenantId, input.accountId, input.sourceTransactionId])
		if (this.transactions.has(key)) {
			throw new HandledError(StatusCode.Conflict, 'This source transaction is already recorded')
		}
		const transaction = { ...input, tenantId: identity.tenantId, transactionId: randomUUID() }
		this.transactions.set(key, transaction)
		return { ...transaction }
	}

	list(identity: Identity, accountId: TransactionInput['accountId']): RecordedTransaction[] {
		this.access.assertAllowed(identity, accountId, 'read')
		return [...this.transactions.values()]
			.filter(transaction => transaction.tenantId === identity.tenantId && transaction.accountId === accountId)
			.map(transaction => ({ ...transaction }))
	}
}
