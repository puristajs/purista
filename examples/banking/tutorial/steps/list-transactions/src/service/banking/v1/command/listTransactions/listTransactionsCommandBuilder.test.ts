import { expect, test } from 'vitest'
import { createTestBank } from '../../../../../testing/createTestBank.js'

test('shares storage between commands and keeps rejected records out of history', async () => {
	const bank = await createTestBank()
	const transaction = {
		accountId: 'account-a',
		sourceTransactionId: 'source-001',
		bookedAt: '2026-01-20T10:00:00.000Z',
		amountMinor: 1250,
		currency: 'EUR',
		direction: 'debit',
	}
	const post = (body: unknown) =>
		bank.request('/api/v1/transactions', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),
		})
	try {
		const empty = await bank.request('/api/v1/accounts/account-a/transactions')
		expect(await empty.json()).toEqual({ accountId: 'account-a', transactions: [] })

		const recorded = await post(transaction)
		expect(recorded.status).toBe(200)
		const saved = await recorded.json()
		expect((await post(transaction)).status).toBe(409)
		expect((await post({ ...transaction, sourceTransactionId: 'source-002', amountMinor: -1 })).status).toBe(400)

		const history = await bank.request('/api/v1/accounts/account-a/transactions')
		expect(history.status).toBe(200)
		expect(await history.json()).toEqual({ accountId: 'account-a', transactions: [saved] })

		const other = await bank.request('/api/v1/accounts/account-c/transactions')
		expect(await other.json()).toEqual({ accountId: 'account-c', transactions: [] })
		expect((await bank.request('/api/v1/accounts/unknown/transactions')).status).toBe(400)
	} finally {
		await bank.destroy()
	}
})
