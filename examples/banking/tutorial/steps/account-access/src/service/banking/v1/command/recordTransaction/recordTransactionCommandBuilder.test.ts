import { expect, test } from 'vitest'
import { createTestBank } from '../../../../../testing/createTestBank.js'

const transaction = {
	accountId: 'account-a',
	sourceTransactionId: 'source-001',
	bookedAt: '2026-01-20T10:00:00.000Z',
	amountMinor: 1250,
	currency: 'EUR',
	direction: 'debit',
}

test('an authorized caller records a transaction; duplicates and invalid amounts are rejected', async () => {
	const bank = await createTestBank()
	try {
		const dana = await bank.login('dana')
		const post = (body: unknown) =>
			dana.request('/api/v1/transactions', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body),
			})
		const recorded = await post(transaction)
		expect(recorded.status).toBe(200)
		expect(await recorded.json()).toEqual({
			...transaction,
			tenantId: 'tenant-north',
			transactionId: expect.any(String),
		})
		expect((await post(transaction)).status).toBe(409)
		const invalid = await post({ ...transaction, sourceTransactionId: 'source-002', amountMinor: 12.5 })
		expect(invalid.status).toBe(400)
		expect(invalid.headers.get('content-type')).toContain('application/problem+json')
	} finally {
		await bank.destroy()
	}
})
