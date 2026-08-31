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

test('records a transaction and rejects duplicate and invalid requests', async () => {
	const bank = await createTestBank()
	const post = (body: unknown) =>
		bank.request('/api/v1/transactions', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),
		})
	try {
		const recorded = await post(transaction)
		expect(recorded.status).toBe(200)
		expect(await recorded.json()).toEqual({
			...transaction,
			transactionId: expect.any(String),
		})

		const duplicate = await post(transaction)
		expect(duplicate.status).toBe(409)

		const invalid = await post({ ...transaction, sourceTransactionId: 'source-002', amountMinor: 12.5 })
		expect(invalid.status).toBe(400)
		expect(invalid.headers.get('content-type')).toContain('application/problem+json')
		expect(await invalid.json()).toMatchObject({ status: 400 })
	} finally {
		await bank.destroy()
	}
})
