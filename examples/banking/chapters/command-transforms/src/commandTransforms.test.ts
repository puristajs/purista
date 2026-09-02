import { initLogger } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test } from 'vitest'
import { createApplication } from './application.js'
import type { ManagedTransactionRepository } from './resources/ManagedTransactionRepository.js'
import type { AccountAccessPolicy } from './service/transaction/v1/AccountAccessPolicy.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

function repository(
	save = sandbox.stub(),
	findById = sandbox.stub(),
): ManagedTransactionRepository {
	return { name: 'sqliteTransactionRepository', save, findById, destroy: sandbox.stub().resolves() }
}

async function destroyApplication(app: Awaited<ReturnType<typeof createApplication>>) {
	await new Promise<void>(resolve => setImmediate(resolve))
	await app.http.prepareDestroy().destroy()
	await app.http.destroy()
	await app.transaction.destroy()
	await app.identity.destroy()
	await app.bankProfile.destroy()
	await app.identityStateStore.destroy()
	await app.transactionRepository.destroy()
	await app.eventBridge.destroy()
}

async function login(app: Awaited<ReturnType<typeof createApplication>>, username = 'alex@example.test') {
	const response = await app.http.app.request('/api/v1/session/login', {
		method: 'POST', headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ username, password: 'demo-password' }),
	})
	expect(response.status).toBe(200)
	const body = await response.json() as { sessionToken: string }
	return { authorization: `Bearer ${body.sessionToken}` }
}

const importPath = '/api/v1/accounts/account-operating/transactions/import'

describe('registered command transform lifecycle', () => {
	test('transforms valid text, authorizes the action, and then writes domain data', async () => {
		const order: string[] = []
		const policy: AccountAccessPolicy = {
			isAllowed: sandbox.stub().callsFake(() => { order.push('before guard'); return true }),
		}
		const stored = {
			accountId: 'account-operating', tenantId: 'tenant-example', transactionId: crypto.randomUUID(),
			amountCents: 1, direction: 'credit' as const, counterparty: 'Coffee Shop',
			recordedAt: new Date().toISOString(),
		}
		const save = sandbox.stub().callsFake(async input => { order.push('handler'); return { ...input, ...stored } })
		const app = await createApplication(initLogger('fatal'), repository(save), undefined, undefined, policy)
		try {
			const auth = await login(app)
			const response = await app.http.app.request(importPath, {
				method: 'POST', headers: { ...auth, 'content-type': 'text/plain' },
				body: 'credit|0.01|Coffee Shop',
			})
			expect(response.status).toBe(200)
			expect(order).toEqual(['before guard', 'handler'])
			expect(save.firstCall.args[0]).toMatchObject({ amountCents: 1, direction: 'credit', counterparty: 'Coffee Shop' })
		} finally { await destroyApplication(app) }
	})

	test('stops malformed input before the guard and handler', async () => {
		const isAllowed = sandbox.stub().returns(true)
		const save = sandbox.stub()
		const app = await createApplication(
			initLogger('fatal'), repository(save), undefined, undefined, { isAllowed },
		)
		try {
			const auth = await login(app)
			const response = await app.http.app.request(importPath, {
				method: 'POST', headers: { ...auth, 'content-type': 'text/plain' },
				body: 'debit|25,99|Northwind Books',
			})
			expect(response.status).toBe(400)
			expect(isAllowed.called).toBe(false)
			expect(save.called).toBe(false)
		} finally { await destroyApplication(app) }
	})

	test('does not let a successful transform authorize a denied action', async () => {
		const save = sandbox.stub()
		const app = await createApplication(initLogger('fatal'), repository(save))
		try {
			const auth = await login(app, 'sam@example.test')
			const response = await app.http.app.request(importPath, {
				method: 'POST', headers: { ...auth, 'content-type': 'text/plain' },
				body: 'debit|25.99|Northwind Books',
			})
			expect(response.status).toBe(403)
			expect(save.called).toBe(false)
		} finally { await destroyApplication(app) }
	})

	test('validates and guards the domain result before creating CSV', async () => {
		const order: string[] = []
		const policy: AccountAccessPolicy = {
			isAllowed: sandbox.stub().callsFake(() => { order.push('guard'); return true }),
		}
		const transactionId = crypto.randomUUID()
		const findById = sandbox.stub().callsFake(async () => {
			order.push('handler')
			return {
				accountId: 'account-operating', tenantId: 'tenant-example', transactionId,
				amountCents: 2599, direction: 'debit', counterparty: 'Northwind Books',
				recordedAt: '2026-09-01T10:00:00.000Z',
			}
		})
		const app = await createApplication(initLogger('fatal'), repository(undefined, findById), undefined, undefined, policy)
		try {
			const auth = await login(app)
			const response = await app.http.app.request(
				`/api/v1/accounts/account-operating/transactions/${transactionId}/export`, { headers: auth },
			)
			expect(response.status).toBe(200)
			expect(order).toEqual(['guard', 'handler', 'guard'])
			expect(response.headers.get('content-type')).toContain('text/csv')
		} finally { await destroyApplication(app) }
	})

	test('does not serialize a result rejected by the after guard', async () => {
		const isAllowed = sandbox.stub()
		isAllowed.onFirstCall().returns(true)
		isAllowed.onSecondCall().returns(false)
		const transactionId = crypto.randomUUID()
		const findById = sandbox.stub().resolves({
			accountId: 'account-operating', tenantId: 'tenant-example', transactionId,
			amountCents: 2599, direction: 'debit', counterparty: 'Private Counterparty',
			recordedAt: '2026-09-01T10:00:00.000Z',
		})
		const app = await createApplication(
			initLogger('fatal'), repository(undefined, findById), undefined, undefined, { isAllowed },
		)
		try {
			const auth = await login(app)
			const response = await app.http.app.request(
				`/api/v1/accounts/account-operating/transactions/${transactionId}/export`, { headers: auth },
			)
			expect(response.status).toBe(403)
			expect(response.headers.get('content-type')).toContain('application/problem+json')
			expect(await response.text()).not.toContain('Private Counterparty')
		} finally { await destroyApplication(app) }
	})
})
