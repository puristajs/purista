import { expect, test } from 'vitest'
import { createTestBank } from '../../../../../testing/createTestBank.js'

test('authorized commands share storage and rejected records stay out of history', async () => {
	const bank = await createTestBank()
	try {
		const dana = await bank.login('dana')
		const transaction = {
			accountId: 'account-a',
			sourceTransactionId: 'source-001',
			bookedAt: '2026-01-20T10:00:00.000Z',
			amountMinor: 1250,
			currency: 'EUR',
			direction: 'debit',
		}
		const post = (body: unknown) =>
			dana.request('/api/v1/transactions', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body),
			})
		const empty = await dana.request('/api/v1/accounts/account-a/transactions')
		expect(await empty.json()).toEqual({ tenantId: 'tenant-north', accountId: 'account-a', transactions: [] })
		const recorded = await post(transaction)
		expect(recorded.status).toBe(200)
		const saved = await recorded.json()
		expect((await post(transaction)).status).toBe(409)
		expect((await post({ ...transaction, sourceTransactionId: 'bad', amountMinor: -1 })).status).toBe(400)
		const history = await dana.request('/api/v1/accounts/account-a/transactions')
		expect(await history.json()).toEqual({ tenantId: 'tenant-north', accountId: 'account-a', transactions: [saved] })
		const carol = await bank.login('carol')
		const other = await carol.request('/api/v1/accounts/account-c/transactions')
		expect(await other.json()).toEqual({ tenantId: 'tenant-north', accountId: 'account-c', transactions: [] })
		expect((await dana.request('/api/v1/accounts/unknown/transactions')).status).toBe(400)
	} finally {
		await bank.destroy()
	}
})
