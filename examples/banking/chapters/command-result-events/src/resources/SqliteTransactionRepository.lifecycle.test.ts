import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { expect, test } from 'vitest'
import { SqliteTransactionRepository } from './SqliteTransactionRepository.js'

test('closes a file database and preserves its scoped transaction for the next connection', async () => {
	const directory = await mkdtemp(join(tmpdir(), 'example-bank-sqlite-'))
	const filename = join(directory, 'transactions.sqlite')
	try {
		const first = new SqliteTransactionRepository(filename)
		const saved = await first.save({
			accountId: 'account-operating',
			tenantId: 'tenant-example',
			amountCents: 2599,
			direction: 'debit',
			counterparty: 'Northwind Books',
		})
		await first.destroy()
		await first.destroy()

		const second = new SqliteTransactionRepository(filename)
		try {
			expect(await second.findById(saved.transactionId)).toEqual(saved)
		} finally {
			await second.destroy()
		}
	} finally {
		await rm(directory, { recursive: true, force: true })
	}
})

test('adds account scope to a database created by the earlier chapter', async () => {
	const directory = await mkdtemp(join(tmpdir(), 'example-bank-sqlite-migration-'))
	const filename = join(directory, 'transactions.sqlite')
	const transactionId = '3bd00f72-8db0-4f39-875d-fd5e251a7f32'
	try {
		const legacy = new DatabaseSync(filename)
		legacy.exec(`
			CREATE TABLE transactions (
				transaction_id TEXT PRIMARY KEY,
				amount_cents INTEGER NOT NULL,
				direction TEXT NOT NULL,
				counterparty TEXT NOT NULL,
				reference TEXT,
				recorded_at TEXT NOT NULL
			);
			INSERT INTO transactions (
				transaction_id, amount_cents, direction, counterparty, recorded_at
			) VALUES (
				'3bd00f72-8db0-4f39-875d-fd5e251a7f32', 2599, 'debit', 'Northwind Books', '2026-09-01T10:00:00.000Z'
			);
		`)
		legacy.close()

		const repository = new SqliteTransactionRepository(filename)
		try {
			expect(await repository.findById(transactionId)).toMatchObject({
				accountId: 'account-operating',
				tenantId: 'tenant-example',
			})
		} finally {
			await repository.destroy()
		}
	} finally {
		await rm(directory, { recursive: true, force: true })
	}
})
