import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import type { StoreTransaction, Transaction } from '../service/transaction/v1/transaction.js'
import { transactionSchema } from '../service/transaction/v1/transaction.js'
import type { ManagedTransactionRepository } from './ManagedTransactionRepository.js'

type TransactionRow = {
	transaction_id: string
	account_id: string
	tenant_id: string
	amount_cents: number
	direction: string
	counterparty: string
	reference: string | null
	recorded_at: string
}

export class SqliteTransactionRepository implements ManagedTransactionRepository {
	readonly name = 'sqliteTransactionRepository' as const
	readonly #database: DatabaseSync
	#closed = false

	constructor(filename = ':memory:') {
		if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true })
		this.#database = new DatabaseSync(filename)
		this.#database.exec(`
			CREATE TABLE IF NOT EXISTS transactions (
				transaction_id TEXT PRIMARY KEY,
				account_id TEXT NOT NULL,
				tenant_id TEXT NOT NULL,
				amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
				direction TEXT NOT NULL CHECK (direction IN ('credit', 'debit')),
				counterparty TEXT NOT NULL,
				reference TEXT,
				recorded_at TEXT NOT NULL
			)
		`)
		const columns = new Set(
			(this.#database.prepare('PRAGMA table_info(transactions)').all() as Array<{ name: string }>)
				.map(column => column.name),
		)
		if (!columns.has('account_id')) {
			this.#database.exec("ALTER TABLE transactions ADD COLUMN account_id TEXT NOT NULL DEFAULT 'account-operating'")
		}
		if (!columns.has('tenant_id')) {
			this.#database.exec("ALTER TABLE transactions ADD COLUMN tenant_id TEXT NOT NULL DEFAULT 'tenant-example'")
		}
	}

	async save(input: StoreTransaction) {
		const transaction = transactionSchema.parse({
			...input,
			transactionId: randomUUID(),
			recordedAt: new Date().toISOString(),
		})
		this.#database.prepare(`
			INSERT INTO transactions (
				transaction_id, account_id, tenant_id, amount_cents, direction,
				counterparty, reference, recorded_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`).run(
			transaction.transactionId,
			transaction.accountId,
			transaction.tenantId,
			transaction.amountCents,
			transaction.direction,
			transaction.counterparty,
			transaction.reference ?? null,
			transaction.recordedAt,
		)
		return transaction
	}

	async findById(transactionId: string) {
		const row = this.#database.prepare(`
			SELECT transaction_id, account_id, tenant_id, amount_cents, direction,
				counterparty, reference, recorded_at
			FROM transactions
			WHERE transaction_id = ?
		`).get(transactionId) as TransactionRow | undefined
		if (!row) return undefined
		return transactionSchema.parse({
			transactionId: row.transaction_id,
			accountId: row.account_id,
			tenantId: row.tenant_id,
			amountCents: row.amount_cents,
			direction: row.direction,
			counterparty: row.counterparty,
			reference: row.reference ?? undefined,
			recordedAt: row.recorded_at,
		})
	}

	async destroy() {
		if (this.#closed) return
		this.#database.close()
		this.#closed = true
	}
}
