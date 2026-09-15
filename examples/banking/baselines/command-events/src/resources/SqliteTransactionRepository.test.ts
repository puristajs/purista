import { afterEach, expect, test } from 'vitest'
import { SqliteTransactionRepository } from './SqliteTransactionRepository.js'

let repository: SqliteTransactionRepository | undefined
afterEach(async () => repository?.destroy())

test('stores a transaction in SQLite', async () => {
	repository = new SqliteTransactionRepository(':memory:')

	const stored = await repository.save({
		accountId: 'account-operating',
		tenantId: 'tenant-example',
		amountCents: 12_500,
		direction: 'debit',
		counterparty: 'Northwind Books',
	})

	expect(stored).toMatchObject({
		accountId: 'account-operating',
		tenantId: 'tenant-example',
		amountCents: 12_500,
	})
	expect(stored.transactionId).toBeTypeOf('string')
})

test('rejects invalid domain input before writing', async () => {
	repository = new SqliteTransactionRepository(':memory:')

	await expect(repository.save({
		accountId: 'account-operating',
		tenantId: 'tenant-example',
		amountCents: 0,
		direction: 'debit',
		counterparty: 'Northwind Books',
	})).rejects.toThrow()
})
