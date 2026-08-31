import { createMemoryMetricsRecorder } from '@purista/core'
import { afterEach, describe, expect, it } from 'vitest'

import { createBankingApplication } from './index.js'
import { type BankActor, BankingRepository, type RecordedTransaction } from './repository.js'

let destroy: (() => Promise<void>) | undefined
type BankingFetch = (request: Request) => Response | Promise<Response>

afterEach(async () => {
	await destroy?.()
	destroy = undefined
})

const start = async (
	bankingRepository?: BankingRepository,
	metricsRecorder?: ReturnType<typeof createMemoryMetricsRecorder>,
) => {
	const application = await createBankingApplication({ bankingRepository, metricsRecorder })
	destroy = application.destroy
	return application.fetch
}

const waitFor = async (predicate: () => Promise<boolean>, timeoutMs = 1_500) => {
	const deadline = Date.now() + timeoutMs
	while (Date.now() < deadline) {
		if (await predicate()) return
		await new Promise(resolve => setTimeout(resolve, 25))
	}
	throw new Error(`Timed out after ${timeoutMs}ms`)
}

const signIn = async (fetch: BankingFetch, actor: BankActor) => {
	const response = await fetch(
		new Request('http://example.test/auth/login', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ actor }),
		}),
	)
	expect(response.status).toBe(200)
	const cookie = response.headers.get('set-cookie')?.split(';', 1)[0]
	expect(cookie).toBeDefined()
	return cookie as string
}

const asSession = (fetch: BankingFetch, cookie: string, request: Request) => {
	const headers = new Headers(request.headers)
	headers.set('cookie', cookie)
	return fetch(new Request(request, { headers }))
}

describe('Example Bank transaction HTTP boundary', () => {
	it('returns only the account history that a valid mandate allows', async () => {
		const fetch = await start()
		const bob = await signIn(fetch, 'bob')
		const response = await asSession(
			fetch,
			bob,
			new Request('http://example.test/api/v1/accounts/account-a/transactions'),
		)
		expect(response.status).toBe(200)
		expect(await response.json()).toMatchObject({
			accountId: 'account-a',
			transactions: [{ transactionId: 'transaction-seed-a-1' }],
		})

		const denied = await asSession(
			fetch,
			bob,
			new Request('http://example.test/api/v1/accounts/account-c/transactions'),
		)
		expect(denied.status).toBe(403)
	})

	it('normalizes an authorized legacy record and rejects a logged-in bookkeeper posting', async () => {
		const fetch = await start()
		const dana = await signIn(fetch, 'dana')
		const bob = await signIn(fetch, 'bob')
		const alice = await signIn(fetch, 'alice')
		const legacyBody = JSON.stringify({
			source_id: 'legacy-test-1',
			account_ref: 'account-a',
			booked_at: '2026-01-15T12:00:00.000Z',
			amount: '125.40',
			currency: 'EUR',
			dc: 'D',
		})
		const imported = await asSession(
			fetch,
			dana,
			new Request('http://example.test/api/v1/legacy/transactions', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: legacyBody,
			}),
		)
		expect(imported.status).toBe(200)
		expect(await imported.json()).toMatchObject({ amountMinor: 12540, direction: 'debit', accountId: 'account-a' })

		const denied = await asSession(
			fetch,
			bob,
			new Request('http://example.test/api/v1/transactions', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
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

		const history = await asSession(
			fetch,
			alice,
			new Request('http://example.test/api/v1/accounts/account-a/transactions'),
		)
		expect(await history.json()).not.toMatchObject({
			transactions: [expect.objectContaining({ sourceTransactionId: 'bookkeeper-write' })],
		})
	})

	it('serializes an authorized statement only after it passes the result-scope guard', async () => {
		const fetch = await start()
		const bob = await signIn(fetch, 'bob')
		const response = await asSession(fetch, bob, new Request('http://example.test/api/v1/accounts/account-a/statement'))

		expect(response.status).toBe(200)
		expect(response.headers.get('content-type')).toContain('text/csv')
		expect(await response.text()).toContain('transactionId,bookedAt,amountMinor,currency,direction')

		const denied = await asSession(fetch, bob, new Request('http://example.test/api/v1/accounts/account-c/statement'))
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
		const alice = await signIn(fetch, 'alice')
		const response = await asSession(
			fetch,
			alice,
			new Request('http://example.test/api/v1/accounts/account-a/statement'),
		)

		expect(response.status).toBe(403)
		expect(response.headers.get('content-type')).not.toContain('text/csv')
		expect(await response.text()).not.toContain('transaction-faulty-c-1')
	})

	it('publishes an authorized high-value transaction to the assigned monitoring case projection', async () => {
		const fetch = await start()
		const dana = await signIn(fetch, 'dana')
		const erin = await signIn(fetch, 'erin')
		const bob = await signIn(fetch, 'bob')
		const recorded = await asSession(
			fetch,
			dana,
			new Request('http://example.test/api/v1/transactions', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					accountId: 'account-a',
					sourceTransactionId: 'ops-high-value-1',
					bookedAt: '2026-01-15T12:00:00.000Z',
					amountMinor: 100_000,
					currency: 'EUR',
					direction: 'credit',
				}),
			}),
		)
		expect(recorded.status).toBe(200)

		const assigned = await asSession(fetch, erin, new Request('http://example.test/api/v1/review-cases/account-a'))
		expect(assigned.status).toBe(200)
		expect(await assigned.json()).toEqual([
			expect.objectContaining({ transactionId: 'transaction-2', accountId: 'account-a' }),
		])

		const unassigned = await asSession(fetch, bob, new Request('http://example.test/api/v1/review-cases/account-a'))
		expect(unassigned.status).toBe(403)
	})

	it('queues a statement for an authorized reader and exposes only the generated scoped result', async () => {
		const fetch = await start()
		const bob = await signIn(fetch, 'bob')
		const rejected = await asSession(
			fetch,
			bob,
			new Request('http://example.test/api/v1/statements/generate', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ accountId: 'account-c' }),
			}),
		)
		expect(rejected.status).toBe(403)

		const queued = await asSession(
			fetch,
			bob,
			new Request('http://example.test/api/v1/statements/generate', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ accountId: 'account-a' }),
			}),
		)
		expect(queued.status).toBe(200)
		expect(await queued.json()).toMatchObject({ queueName: 'banking.generateStatement' })

		await waitFor(async () => {
			const generated = await asSession(
				fetch,
				bob,
				new Request('http://example.test/api/v1/accounts/account-a/generated-statement'),
			)
			return generated.status === 200
		})

		const generated = await asSession(
			fetch,
			bob,
			new Request('http://example.test/api/v1/accounts/account-a/generated-statement'),
		)
		expect(await generated.json()).toMatchObject({ accountId: 'account-a', transactionCount: 1 })
	})

	it('streams an AI SDK UI response only from the caller-authorized retrieved guide', async () => {
		const fetch = await start()
		const alice = await signIn(fetch, 'alice')
		const bob = await signIn(fetch, 'bob')
		const ingested = await asSession(
			fetch,
			alice,
			new Request('http://example.test/api/v1/knowledge/documents', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					collectionId: 'account-a-documents',
					documentId: 'chat-guide',
					title: 'Statement guide',
					text: 'Monthly statements explain booked transactions and balances.',
					revision: 1,
				}),
			}),
		)
		expect(ingested.status).toBe(200)

		await waitFor(async () => {
			const results = await asSession(
				fetch,
				bob,
				new Request('http://example.test/api/v1/knowledge/search', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ collectionId: 'account-a-documents', query: 'monthly statements' }),
				}),
			)
			return results.status === 200 && ((await results.json()) as unknown[]).length > 0
		})

		const streamed = await asSession(
			fetch,
			bob,
			new Request('http://example.test/api/chat/knowledge', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					collectionId: 'account-a-documents',
					messages: [
						{
							id: 'question-1',
							role: 'user',
							parts: [{ type: 'text', text: 'What does a statement explain?' }],
						},
					],
				}),
			}),
		)
		expect(streamed.status).toBe(200)
		expect(streamed.headers.get('content-type')).toContain('text/event-stream')
		expect(await streamed.text()).toContain('Monthly statements explain booked transactions and balances.')

		const denied = await asSession(
			fetch,
			bob,
			new Request('http://example.test/api/chat/knowledge', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					collectionId: 'account-c-documents',
					messages: [{ id: 'question-2', role: 'user', parts: [{ type: 'text', text: 'Show account C.' }] }],
				}),
			}),
		)
		expect(denied.status).toBe(403)
	})

	it('uses only the opaque local session for identity and invalidates it on logout', async () => {
		const fetch = await start()
		const bob = await signIn(fetch, 'bob')

		const whoami = await asSession(fetch, bob, new Request('http://example.test/auth/whoami'))
		expect(await whoami.json()).toEqual({ principalId: 'bob', tenantId: 'tenant-north' })

		const forgedHeader = await asSession(
			fetch,
			bob,
			new Request('http://example.test/api/v1/transactions', {
				method: 'POST',
				headers: { 'content-type': 'application/json', 'x-example-actor': 'dana' },
				body: JSON.stringify({
					accountId: 'account-a',
					sourceTransactionId: 'forged-dana-write',
					bookedAt: '2026-01-15T12:00:00.000Z',
					amountMinor: 100,
					currency: 'EUR',
					direction: 'debit',
				}),
			}),
		)
		expect(forgedHeader.status).toBe(403)

		const forgedOnly = await fetch(
			new Request('http://example.test/api/v1/accounts/account-a/transactions', {
				headers: { 'x-example-actor': 'alice' },
			}),
		)
		expect(forgedOnly.status).toBe(401)

		const unknownSession = await fetch(
			new Request('http://example.test/api/v1/accounts/account-a/transactions', {
				headers: { cookie: 'example_bank_session=not-a-session' },
			}),
		)
		expect(unknownSession.status).toBe(401)

		const logout = await asSession(fetch, bob, new Request('http://example.test/auth/logout', { method: 'POST' }))
		expect(logout.status).toBe(204)
		expect(logout.headers.get('set-cookie')).toContain('Max-Age=0')

		const afterLogout = await asSession(
			fetch,
			bob,
			new Request('http://example.test/api/v1/accounts/account-a/transactions'),
		)
		expect(afterLogout.status).toBe(401)
	})

	it('records bounded business metrics without account, person, or transaction identifiers', async () => {
		const metricsRecorder = createMemoryMetricsRecorder()
		const fetch = await start(undefined, metricsRecorder)
		const dana = await signIn(fetch, 'dana')
		const bob = await signIn(fetch, 'bob')

		const recorded = await asSession(
			fetch,
			dana,
			new Request('http://example.test/api/v1/transactions', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					accountId: 'account-a',
					sourceTransactionId: 'metric-high-value-1',
					bookedAt: '2026-01-15T12:00:00.000Z',
					amountMinor: 100_000,
					currency: 'EUR',
					direction: 'credit',
				}),
			}),
		)
		expect(recorded.status).toBe(200)

		const statement = await asSession(
			fetch,
			bob,
			new Request('http://example.test/api/v1/statements/generate', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ accountId: 'account-a' }),
			}),
		)
		expect(statement.status).toBe(200)

		await waitFor(async () => metricsRecorder.records.some(record => record.name === 'example.bank.background.jobs'))

		expect(metricsRecorder.records).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: 'example.bank.review.signals',
					attributes: { rule_version: 'training-v1', outcome: 'recorded' },
				}),
				expect.objectContaining({
					name: 'example.bank.background.jobs',
					attributes: { job: 'statement-request', outcome: 'queued' },
				}),
			]),
		)
		for (const record of metricsRecorder.records) {
			expect(Object.keys(record.attributes)).not.toEqual(
				expect.arrayContaining(['accountId', 'principalId', 'transactionId', 'tenantId']),
			)
		}
	})
})
