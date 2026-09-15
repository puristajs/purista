import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import type { TransactionAnalysisReader } from '../service/analysis/v1/TransactionAnalysisReader.js'
import {
	analysisTransactionSchema,
	type TransactionAnalysisScope,
} from '../service/analysis/v1/transactionAnalysis.js'

type Row = {
	transaction_id: string
	amount_cents: number
	direction: string
	counterparty: string
	recorded_at: string
}

export class SqliteTransactionAnalysisReader implements TransactionAnalysisReader {
	readonly name = 'sqliteTransactionAnalysisReader' as const
	readonly #database: DatabaseSync
	#closed = false

	constructor(filename = ':memory:') {
		if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true })
		this.#database = new DatabaseSync(filename)
		this.#database.exec(`
			CREATE TABLE IF NOT EXISTS transaction_analysis_projection (
				transaction_id TEXT PRIMARY KEY,
				tenant_id TEXT NOT NULL,
				principal_id TEXT NOT NULL,
				account_id TEXT NOT NULL,
				amount_cents INTEGER NOT NULL,
				direction TEXT NOT NULL,
				counterparty TEXT NOT NULL,
				recorded_at TEXT NOT NULL
			)
		`)
		const existing = this.#database.prepare(
			'SELECT COUNT(*) AS count FROM transaction_analysis_projection',
		).get() as { count: number }
		if (existing.count === 0) this.#seed()
	}

	#seed() {
		const insert = this.#database.prepare(`
			INSERT INTO transaction_analysis_projection (
				transaction_id, tenant_id, principal_id, account_id,
				amount_cents, direction, counterparty, recorded_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`)
		for (const row of [
			[2_500, 'debit', 'Northwind Books', '2026-01-03T10:00:00.000Z'],
			[8_000, 'credit', 'Example Payroll', '2026-01-02T10:00:00.000Z'],
			[1_200, 'debit', 'City Transit', '2026-01-01T10:00:00.000Z'],
		] as const) {
			insert.run(
				randomUUID(), 'tenant-example', 'principal-alex', 'account-operating', ...row,
			)
		}
	}

	async canReadAccount(scope: TransactionAnalysisScope) {
		const row = this.#database.prepare(`
			SELECT 1 AS allowed FROM transaction_analysis_projection
			WHERE tenant_id = ? AND principal_id = ? AND account_id = ? LIMIT 1
		`).get(scope.tenantId, scope.principalId, scope.accountId)
		return row !== undefined
	}

	async listRecent(scope: TransactionAnalysisScope, limit: number, signal?: AbortSignal) {
		signal?.throwIfAborted()
		const rows = this.#database.prepare(`
			SELECT transaction_id, amount_cents, direction, counterparty, recorded_at
			FROM transaction_analysis_projection
			WHERE tenant_id = ? AND principal_id = ? AND account_id = ?
			ORDER BY recorded_at DESC LIMIT ?
		`).all(scope.tenantId, scope.principalId, scope.accountId, limit) as Row[]
		signal?.throwIfAborted()
		return rows.map(row => analysisTransactionSchema.parse({
			transactionId: row.transaction_id,
			amountCents: row.amount_cents,
			direction: row.direction,
			counterparty: row.counterparty,
			recordedAt: row.recorded_at,
		}))
	}

	async destroy() {
		if (this.#closed) return
		this.#database.close()
		this.#closed = true
	}
}
