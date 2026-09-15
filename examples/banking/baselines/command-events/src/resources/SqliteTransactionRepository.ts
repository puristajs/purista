import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import type { TransactionRepository } from '../service/transaction/v1/TransactionRepository.js'
import type { CreateTransaction } from '../service/transaction/v1/transaction.js'
import { createTransactionSchema, transactionSchema } from '../service/transaction/v1/transaction.js'

export class SqliteTransactionRepository implements TransactionRepository {
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
				recorded_at TEXT NOT NULL
			)
		`)
	}

	async save(input: CreateTransaction) {
		const validated = createTransactionSchema.parse(input)
		const transaction = transactionSchema.parse({
			...validated,
			transactionId: randomUUID(),
			recordedAt: new Date().toISOString(),
		})
		this.#database.prepare(`
			INSERT INTO transactions (
				transaction_id, account_id, tenant_id, amount_cents, direction, counterparty, recorded_at
			) VALUES (?, ?, ?, ?, ?, ?, ?)
		`).run(
			transaction.transactionId,
			transaction.accountId,
			transaction.tenantId,
			transaction.amountCents,
			transaction.direction,
			transaction.counterparty,
			transaction.recordedAt,
		)
		return transaction
	}

	async destroy() {
		if (this.#closed) return
		this.#database.close()
		this.#closed = true
	}
}
