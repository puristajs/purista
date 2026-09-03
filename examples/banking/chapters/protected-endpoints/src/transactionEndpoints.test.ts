import { initLogger } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test } from 'vitest'
import { createApplication } from './application.js'
import { DEMO_API_KEY } from './demoProtectMiddleware.js'
import type { ManagedTransactionRepository } from './resources/ManagedTransactionRepository.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

async function withApplication(
	repository: ManagedTransactionRepository,
	testFunction: (app: Awaited<ReturnType<typeof createApplication>>) => Promise<void>,
) {
	const app = await createApplication(initLogger('fatal'), repository)
	try {
		await testFunction(app)
		// Let Hono finish the middleware response before destroying its services.
		await new Promise<void>(resolve => setImmediate(resolve))
	} finally {
		await app.http.prepareDestroy().destroy()
		await app.http.destroy()
		await app.transaction.destroy()
		await app.bankProfile.destroy()
		await app.transactionRepository.destroy()
		await app.eventBridge.destroy()
	}
}

function managedFake(overrides: Partial<ManagedTransactionRepository> = {}): ManagedTransactionRepository {
	return {
		name: 'sqliteTransactionRepository',
		save: sandbox.stub(),
		findById: sandbox.stub(),
		destroy: sandbox.stub().resolves(),
		...overrides,
	}
}

function protectedHeaders(extra: Record<string, string> = {}) {
	return {
		'content-type': 'application/json',
		authorization: `Bearer ${DEMO_API_KEY}`,
		...extra,
	}
}

describe('generated transaction endpoints', () => {
	test('keeps the public profile available without credentials', async () => {
		await withApplication(managedFake(), async app => {
			const response = await app.http.app.request('/api/v1/profile')
			expect(response.status).toBe(200)
			expect(await response.json()).toEqual({ name: 'Example Bank', currency: 'EUR' })
		})
	})

	test.each([
		['missing', undefined],
		['invalid', 'Bearer wrong-key'],
	])('denies %s credentials without saving', async (_case, authorization) => {
		const save = sandbox.stub()
		await withApplication(managedFake({ save }), async app => {
			const headers: Record<string, string> = { 'content-type': 'application/json' }
			if (authorization) headers.authorization = authorization
			const response = await app.http.app.request('/api/v1/transactions', {
				method: 'POST',
				headers,
				body: JSON.stringify({ amountCents: 2599, direction: 'debit', counterparty: 'Northwind Books' }),
			})

			expect(response.status).toBe(401)
			expect(await response.json()).toMatchObject({
				status: 401,
				detail: 'A valid demo API key is required',
			})
			expect(save.called).toBe(false)
		})
	})

	test('ignores forged identity headers and keeps them out of the domain payload', async () => {
		const stored = {
			transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
			amountCents: 2599,
			direction: 'debit' as const,
			counterparty: 'Northwind Books',
			recordedAt: '2026-09-01T10:00:00.000Z',
		}
		const save = sandbox.stub().resolves(stored)
		await withApplication(managedFake({ save }), async app => {
			const response = await app.http.app.request('/api/v1/transactions', {
				method: 'POST',
				headers: protectedHeaders({
					'x-principal-id': 'principal-attacker',
					'x-tenant-id': 'tenant-attacker',
				}),
				body: JSON.stringify({ amountCents: 2599, direction: 'debit', counterparty: 'Northwind Books' }),
			})

			expect(response.status).toBe(200)
			await response.json()
			expect(save.calledOnceWithExactly({
				amountCents: 2599,
				direction: 'debit',
				counterparty: 'Northwind Books',
			})).toBe(true)
		})
	})

	test('rejects invalid command input after authentication without saving', async () => {
		const save = sandbox.stub()
		await withApplication(managedFake({ save }), async app => {
			const response = await app.http.app.request('/api/v1/transactions', {
				method: 'POST',
				headers: protectedHeaders(),
				body: JSON.stringify({ amountCents: 0, direction: 'debit', counterparty: 'Northwind Books' }),
			})
			expect(response.status).toBe(400)
			await response.json()
			expect(save.called).toBe(false)
		})
	})

	test('returns Problem Details when an authenticated transaction is missing', async () => {
		await withApplication(managedFake({ findById: sandbox.stub().resolves(undefined) }), async app => {
			const response = await app.http.app.request(
				'/api/v1/transactions/3bd00f72-8db0-4f39-875d-fd5e251a7f32',
				{ headers: protectedHeaders() },
			)
			expect(response.status).toBe(404)
			expect(await response.json()).toMatchObject({ status: 404, detail: 'Transaction not found' })
		})
	})

	test('records and reads through real SQLite with valid credentials', async () => {
		await withApplication(new SqliteTransactionRepository(':memory:'), async app => {
			const recordedResponse = await app.http.app.request('/api/v1/transactions', {
				method: 'POST',
				headers: protectedHeaders(),
				body: JSON.stringify({ amountCents: 2599, direction: 'debit', counterparty: 'Northwind Books' }),
			})
			expect(recordedResponse.status).toBe(200)
			const recorded = (await recordedResponse.json()) as { transactionId: string }

			const readResponse = await app.http.app.request(
				`/api/v1/transactions/${recorded.transactionId}`,
				{ headers: protectedHeaders() },
			)
			expect(readResponse.status).toBe(200)
			expect(await readResponse.json()).toMatchObject({
				transactionId: recorded.transactionId,
				amountCents: 2599,
				counterparty: 'Northwind Books',
			})
		})
	})
})
