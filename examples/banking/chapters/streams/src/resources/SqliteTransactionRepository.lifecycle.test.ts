import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from 'vitest'
import { SqliteTransactionRepository } from './SqliteTransactionRepository.js'

test('closes a file database and preserves its transaction for the next connection', async () => {
	const directory = await mkdtemp(join(tmpdir(), 'example-bank-sqlite-'))
	const filename = join(directory, 'transactions.sqlite')
	try {
		const first = new SqliteTransactionRepository(filename)
		const saved = await first.save({
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
