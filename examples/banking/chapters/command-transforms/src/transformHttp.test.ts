import { initLogger } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test } from 'vitest'
import { createApplication } from './application.js'
import type { ManagedTransactionRepository } from './resources/ManagedTransactionRepository.js'

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

async function login(app: Awaited<ReturnType<typeof createApplication>>) {
	const response = await app.http.app.request('/api/v1/session/login', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ username: 'alex@example.test', password: 'demo-password' }),
	})
	expect(response.status).toBe(200)
	const body = await response.json() as { sessionToken: string }
	return { authorization: `Bearer ${body.sessionToken}` }
}

describe('transformed command HTTP contracts', () => {
	test('accepts the declared plain-text input representation', async () => {
		const stored = {
			accountId: 'account-operating', tenantId: 'tenant-example', transactionId: crypto.randomUUID(),
			amountCents: 2599, direction: 'debit' as const, counterparty: 'Northwind Books', reference: 'Order 1042',
			recordedAt: new Date().toISOString(),
		}
		const save = sandbox.stub().resolves(stored)
		const app = await createApplication(initLogger('fatal'), repository(save))
		try {
			const auth = await login(app)
			const response = await app.http.app.request('/api/v1/accounts/account-operating/transactions/import', {
				method: 'POST',
				headers: { ...auth, 'content-type': 'text/plain; charset=utf-8' },
				body: 'debit|25.99|Northwind Books|Order 1042',
			})
			expect(response.status).toBe(200)
			expect(response.headers.get('content-type')).toContain('application/json')
			expect(save.calledOnceWith({
				accountId: 'account-operating', tenantId: 'tenant-example', amountCents: 2599,
				direction: 'debit', counterparty: 'Northwind Books', reference: 'Order 1042',
			})).toBe(true)
		} finally { await destroyApplication(app) }
	})

	test('rejects a representation that the command did not declare', async () => {
		const save = sandbox.stub()
		const app = await createApplication(initLogger('fatal'), repository(save))
		try {
			const auth = await login(app)
			const response = await app.http.app.request('/api/v1/accounts/account-operating/transactions/import', {
				method: 'POST',
				headers: { ...auth, 'content-type': 'application/json' },
				body: JSON.stringify({ record: 'debit|25.99|Northwind Books' }),
			})
			expect(response.status).toBe(400)
			expect(response.headers.get('content-type')).toContain('application/problem+json')
			expect(save.called).toBe(false)
		} finally { await destroyApplication(app) }
	})

	test('returns the declared CSV representation', async () => {
		const transactionId = crypto.randomUUID()
		const findById = sandbox.stub().resolves({
			accountId: 'account-operating', tenantId: 'tenant-example', transactionId,
			amountCents: 2599, direction: 'debit', counterparty: 'Northwind Books', reference: 'Order 1042',
			recordedAt: '2026-09-01T10:00:00.000Z',
		})
		const app = await createApplication(initLogger('fatal'), repository(undefined, findById))
		try {
			const auth = await login(app)
			const response = await app.http.app.request(
				`/api/v1/accounts/account-operating/transactions/${transactionId}/export`,
				{ headers: auth },
			)
			expect(response.status).toBe(200)
			const csv = await response.text()
			expect(csv).toContain('transactionId,accountId,recordedAt,direction,amountCents,counterparty,reference')
			expect(csv).not.toContain('tenant-example')
		} finally { await destroyApplication(app) }
	})
})
