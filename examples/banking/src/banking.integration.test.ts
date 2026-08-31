import { afterEach, describe, expect, it } from 'vitest'

import { createBankingApplication } from './index.js'

let destroy: (() => Promise<void>) | undefined

afterEach(async () => {
	await destroy?.()
	destroy = undefined
})

const start = async () => {
	const application = await createBankingApplication()
	destroy = application.destroy
	return application.fetch
}

describe('Example Bank transaction HTTP boundary', () => {
	it('returns only the account history that a valid mandate allows', async () => {
		const fetch = await start()
		const response = await fetch(new Request('http://example.test/api/v1/accounts/account-a/transactions', { headers: { 'x-example-actor': 'bob' } }))
		expect(response.status).toBe(200)
		expect(await response.json()).toMatchObject({ accountId: 'account-a', transactions: [{ transactionId: 'transaction-seed-a-1' }] })

		const denied = await fetch(new Request('http://example.test/api/v1/accounts/account-c/transactions', { headers: { 'x-example-actor': 'bob' } }))
		expect(denied.status).toBe(403)
	})

	it('normalizes an authorized legacy record and rejects a logged-in bookkeeper posting', async () => {
		const fetch = await start()
		const legacyBody = JSON.stringify({
			source_id: 'legacy-test-1',
			account_ref: 'account-a',
			booked_at: '2026-01-15T12:00:00.000Z',
			amount: '125.40',
			currency: 'EUR',
			dc: 'D',
		})
		const imported = await fetch(
			new Request('http://example.test/api/v1/legacy/transactions', {
				method: 'POST',
				headers: { 'content-type': 'application/json', 'x-example-actor': 'dana' },
				body: legacyBody,
			}),
		)
		expect(imported.status).toBe(200)
		expect(await imported.json()).toMatchObject({ amountMinor: 12540, direction: 'debit', accountId: 'account-a' })

		const denied = await fetch(
			new Request('http://example.test/api/v1/transactions', {
				method: 'POST',
				headers: { 'content-type': 'application/json', 'x-example-actor': 'bob' },
				body: JSON.stringify({
					accountId: 'account-a',
					sourceTransactionId: 'bookkeeper-write',
					bookedAt: '2026-01-15T12:00:00.000Z',
					amountMinor: 100,
					currency: 'EUR',
					direction: 'debit',
				}),
			}),
		)
		expect(denied.status).toBe(403)
	})
})
