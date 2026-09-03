import { describe, expect, test } from 'vitest'
import { SqliteTransactionRepository } from './SqliteTransactionRepository.js'

describe('SqliteTransactionRepository', () => {
	test('saves, reads, and misses account-scoped transactions', async () => {
		const repository = new SqliteTransactionRepository(':memory:')
		try {
			const saved = await repository.save({
				accountId: 'account-operating',
				tenantId: 'tenant-example',
				amountCents: 2599,
				direction: 'debit',
				counterparty: 'Northwind Books',
			})
			expect(await repository.findById(saved.transactionId)).toEqual(saved)
			expect(await repository.findById(crypto.randomUUID())).toBeUndefined()
		} finally {
			await repository.destroy()
		}
	})
})
