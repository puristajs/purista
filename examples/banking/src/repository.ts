import { HandledError, StatusCode } from '@purista/core'

export type BankActor = 'alice' | 'bob' | 'carol' | 'dana' | 'erin'
export type TransactionDirection = 'debit' | 'credit'
/** The one local projection source that this tutorial can reconcile. */
export type ReconciliationSource = 'banking-projections'

export type RecordedTransaction = {
	transactionId: string
	tenantId: 'tenant-north'
	accountId: 'account-a' | 'account-c'
	sourceTransactionId: string
	bookedAt: string
	amountMinor: number
	currency: 'EUR'
	direction: TransactionDirection
}

const readMandates: Record<BankActor, readonly RecordedTransaction['accountId'][]> = {
	alice: ['account-a'],
	bob: ['account-a'],
	carol: ['account-c'],
	dana: [],
	erin: [],
}

const reviewAssignments: Record<BankActor, readonly RecordedTransaction['accountId'][]> = {
	alice: [],
	bob: [],
	carol: [],
	dana: [],
	erin: ['account-a'],
}

/**
 * Reconciliation is an operations action over a named source, not a customer
 * account-read permission. The fixture gives Dana that assignment only for
 * the local teaching projection.
 */
const reconciliationAssignments: Record<BankActor, readonly ReconciliationSource[]> = {
	alice: [],
	bob: [],
	carol: [],
	dana: ['banking-projections'],
	erin: [],
}

/** In-memory teaching repository. Each application restart restores the same synthetic fixtures. */
export class BankingRepository {
	private transactions: RecordedTransaction[] = [
		{
			transactionId: 'transaction-seed-a-1',
			tenantId: 'tenant-north',
			accountId: 'account-a',
			sourceTransactionId: 'seed-a-1',
			bookedAt: '2026-01-02T10:00:00.000Z',
			amountMinor: 4250,
			currency: 'EUR',
			direction: 'credit',
		},
	]

	canRead(actor: string | undefined, accountId: RecordedTransaction['accountId']) {
		if (!actor || !(actor in readMandates)) return false
		return readMandates[actor as BankActor].includes(accountId)
	}

	canRecord(actor: string | undefined, accountId: RecordedTransaction['accountId']) {
		return actor === 'dana' && accountId === 'account-a'
	}

	/** Case access is a separate assignment from customer account access. */
	canReviewCase(actor: string | undefined, accountId: RecordedTransaction['accountId']) {
		if (!actor || !(actor in reviewAssignments)) return false
		return reviewAssignments[actor as BankActor].includes(accountId)
	}

	/**
	 * Answers whether a current operations assignment covers this tenant and
	 * named reconciliation source. It intentionally does not reuse account-read
	 * or review-case access.
	 */
	canRunReconciliation(actor: string | undefined, tenantId: string | undefined, source: ReconciliationSource) {
		if (tenantId !== 'tenant-north' || !actor || !(actor in reconciliationAssignments)) return false
		return reconciliationAssignments[actor as BankActor].includes(source)
	}

	list(accountId: RecordedTransaction['accountId']) {
		return this.transactions.filter(transaction => transaction.accountId === accountId)
	}

	record(input: Omit<RecordedTransaction, 'transactionId' | 'tenantId'>) {
		const existing = this.transactions.find(
			transaction =>
				transaction.sourceTransactionId === input.sourceTransactionId && transaction.accountId === input.accountId,
		)
		if (existing) {
			if (
				existing.amountMinor !== input.amountMinor ||
				existing.direction !== input.direction ||
				existing.bookedAt !== input.bookedAt
			) {
				throw new HandledError(StatusCode.Conflict, 'A source transaction with different data already exists')
			}
			return existing
		}
		const recorded: RecordedTransaction = {
			...input,
			transactionId: `transaction-${this.transactions.length + 1}`,
			tenantId: 'tenant-north',
		}
		this.transactions.push(recorded)
		return recorded
	}
}
