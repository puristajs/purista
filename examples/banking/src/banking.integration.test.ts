import { afterEach, describe, expect, it } from 'vitest'

import { createBankingApplication } from './index.js'
import { BankingRepository, type RecordedTransaction } from './repository.js'

let destroy: (() => Promise<void>) | undefined

afterEach(async () => {
	await destroy?.()
	destroy = undefined
})

const start = async (bankingRepository?: BankingRepository) => {
	const application = await createBankingApplication({ bankingRepository })
	destroy = application.destroy
	return application.fetch
}

describe('Example Bank transaction HTTP boundary', () => {
	it('returns only the account history that a valid mandate allows', async () => {
		const fetch = await start()
		const response = await fetch(
			new Request('http://example.test/api/v1/accounts/account-a/transactions', {
				headers: { 'x-example-actor': 'bob' },
			}),
		)
		expect(response.status).toBe(200)
		expect(await response.json()).toMatchObject({
			accountId: 'account-a',
			transactions: [{ transactionId: 'transaction-seed-a-1' }],
		})

		const denied = await fetch(
			new Request('http://example.test/api/v1/accounts/account-c/transactions', {
				headers: { 'x-example-actor': 'bob' },
			}),
		)
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

		const history = await fetch(
			new Request('http://example.test/api/v1/accounts/account-a/transactions', {
				headers: { 'x-example-actor': 'alice' },
			}),
		)
		expect(await history.json()).not.toMatchObject({
			transactions: [expect.objectContaining({ sourceTransactionId: 'bookkeeper-write' })],
		})
	})

	it('serializes an authorized statement only after it passes the result-scope guard', async () => {
		const fetch = await start()
		const response = await fetch(
			new Request('http://example.test/api/v1/accounts/account-a/statement', { headers: { 'x-example-actor': 'bob' } }),
		)

		expect(response.status).toBe(200)
		expect(response.headers.get('content-type')).toContain('text/csv')
		expect(await response.text()).toContain('transactionId,bookedAt,amountMinor,currency,direction')

		const denied = await fetch(
			new Request('http://example.test/api/v1/accounts/account-c/statement', { headers: { 'x-example-actor': 'bob' } }),
		)
		expect(denied.status).toBe(403)
	})

	it('denies a faulty mixed-account statement before the output transform can release CSV', async () => {
		class FaultyStatementRepository extends BankingRepository {
			override list(accountId: RecordedTransaction['accountId']) {
				const transactions = super.list(accountId)
				if (accountId !== 'account-a') return transactions
				return [
					...transactions,
					{
						transactionId: 'transaction-faulty-c-1',
						tenantId: 'tenant-north' as const,
						accountId: 'account-c' as const,
						sourceTransactionId: 'faulty-c-1',
						bookedAt: '2026-01-03T10:00:00.000Z',
						amountMinor: 500,
						currency: 'EUR' as const,
						direction: 'debit' as const,
					},
				]
			}
		}

		const fetch = await start(new FaultyStatementRepository())
		const response = await fetch(
			new Request('http://example.test/api/v1/accounts/account-a/statement', {
				headers: { 'x-example-actor': 'alice' },
			}),
		)

		expect(response.status).toBe(403)
		expect(response.headers.get('content-type')).not.toContain('text/csv')
		expect(await response.text()).not.toContain('transaction-faulty-c-1')
	})
})
