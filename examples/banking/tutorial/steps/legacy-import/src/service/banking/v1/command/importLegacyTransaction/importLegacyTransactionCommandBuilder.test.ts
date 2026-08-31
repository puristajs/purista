import { expect, test } from 'vitest'
import { createTestBank } from '../../../../../testing/createTestBank.js'

const legacy = {
	source_id: 'legacy-001',
	account_ref: 'account-a',
	booked_at: '2026-01-15T12:00:00.000Z',
	amount: '125.40',
	currency: 'EUR',
	dc: 'D',
}
const request = (payload: unknown) => ({
	method: 'POST',
	headers: { 'content-type': 'application/json' },
	body: JSON.stringify(payload),
})

test('the registered transform maps debit/credit and shares native duplicate handling', async () => {
	const bank = await createTestBank()
	try {
		const dana = await bank.login('dana')
		const response = await dana.request('/api/v1/legacy-transactions', request(legacy))
		expect(response.status).toBe(200)
		const saved = await response.json()
		expect(saved).toEqual({
			transactionId: expect.any(String),
			tenantId: 'tenant-north',
			accountId: 'account-a',
			sourceTransactionId: 'legacy-001',
			bookedAt: legacy.booked_at,
			amountMinor: 12540,
			currency: 'EUR',
			direction: 'debit',
		})
		expect(
			(
				await dana.request(
					'/api/v1/transactions',
					request({
						accountId: saved.accountId,
						sourceTransactionId: saved.sourceTransactionId,
						bookedAt: saved.bookedAt,
						amountMinor: saved.amountMinor,
						currency: saved.currency,
						direction: saved.direction,
					}),
				)
			).status,
		).toBe(409)
		const credit = await dana.request(
			'/api/v1/legacy-transactions',
			request({
				...legacy,
				source_id: 'legacy-002',
				amount: '0.01',
				dc: 'C',
			}),
		)
		expect(credit.status).toBe(200)
		expect(await credit.json()).toMatchObject({ amountMinor: 1, direction: 'credit' })
		const maximum = await dana.request(
			'/api/v1/legacy-transactions',
			request({
				...legacy,
				source_id: 'legacy-max',
				amount: '90071992547409.91',
			}),
		)
		expect(maximum.status).toBe(200)
		expect(await maximum.json()).toMatchObject({ amountMinor: Number.MAX_SAFE_INTEGER })
	} finally {
		await bank.destroy()
	}
})

test('wire errors, domain errors and forbidden accounts create no records', async () => {
	const bank = await createTestBank()
	try {
		const dana = await bank.login('dana')
		const bob = await bank.login('bob')
		const invalid = [
			{ amount: '125,40' },
			{ amount: '125.401' },
			{ amount: '-1.00' },
			{ amount: '90071992547409.92' },
			{ amount: '0.00' },
			{ currency: 'USD' },
			{ dc: 'X' },
			{ booked_at: '2026-01-15 12:00:00' },
		]
		for (const override of invalid) {
			const response = await dana.request('/api/v1/legacy-transactions', request({ ...legacy, ...override }))
			expect(response.status, JSON.stringify(override)).toBe(400)
		}
		expect((await bob.request('/api/v1/legacy-transactions', request(legacy))).status).toBe(403)
		expect(
			(await dana.request('/api/v1/legacy-transactions', request({ ...legacy, account_ref: 'account-c' }))).status,
		).toBe(403)
		const history = await dana.request('/api/v1/accounts/account-a/transactions')
		expect((await history.json()).transactions).toEqual([])
	} finally {
		await bank.destroy()
	}
})
