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

async function login(app: Awaited<ReturnType<typeof createApplication>>, username: string) {
	const response = await app.http.app.request('/api/v1/session/login', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ username, password: 'demo-password' }),
	})
	expect(response.status).toBe(200)
	const body = await response.json() as { sessionToken: string }
	return { authorization: `Bearer ${body.sessionToken}` }
}

const body = JSON.stringify({
	amountCents: 2599,
	direction: 'debit',
	counterparty: 'Northwind Books',
})

describe('Transaction business guards through generated HTTP endpoints', () => {
	test('allows Alex to record for the operating account', async () => {
		const stored = {
			accountId: 'account-operating', tenantId: 'tenant-example', transactionId: crypto.randomUUID(),
			amountCents: 2599, direction: 'debit' as const, counterparty: 'Northwind Books',
			recordedAt: new Date().toISOString(),
		}
		const save = sandbox.stub().resolves(stored)
		const app = await createApplication(initLogger('fatal'), repository(save))
		try {
			const auth = await login(app, 'alex@example.test')
			const response = await app.http.app.request('/api/v1/accounts/account-operating/transactions', {
				method: 'POST', headers: { ...auth, 'content-type': 'application/json' }, body,
			})
			expect(response.status).toBe(200)
			expect(save.calledOnce).toBe(true)
		} finally { await destroyApplication(app) }
	})

	test('denies Sam before recording for the operating account', async () => {
		const save = sandbox.stub()
		const app = await createApplication(initLogger('fatal'), repository(save))
		try {
			const auth = await login(app, 'sam@example.test')
			const response = await app.http.app.request('/api/v1/accounts/account-operating/transactions', {
				method: 'POST', headers: { ...auth, 'content-type': 'application/json' }, body,
			})
			expect(response.status).toBe(403)
			expect(save.called).toBe(false)
		} finally { await destroyApplication(app) }
	})

	test('denies Alex before reading an account outside the policy', async () => {
		const findById = sandbox.stub()
		const app = await createApplication(initLogger('fatal'), repository(undefined, findById))
		try {
			const auth = await login(app, 'alex@example.test')
			const response = await app.http.app.request(`/api/v1/accounts/account-review/transactions/${crypto.randomUUID()}`, {
				headers: auth,
			})
			expect(response.status).toBe(403)
			expect(findById.called).toBe(false)
		} finally { await destroyApplication(app) }
	})

	test('denies a schema-valid result from another tenant', async () => {
		const transactionId = crypto.randomUUID()
		const findById = sandbox.stub().resolves({
			accountId: 'account-review', tenantId: 'tenant-other', transactionId,
			amountCents: 2599, direction: 'debit', counterparty: 'Northwind Books',
			recordedAt: new Date().toISOString(),
		})
		const app = await createApplication(initLogger('fatal'), repository(undefined, findById))
		try {
			const auth = await login(app, 'sam@example.test')
			const response = await app.http.app.request(`/api/v1/accounts/account-review/transactions/${transactionId}`, {
				headers: auth,
			})
			expect(response.status).toBe(403)
			expect(findById.calledOnce).toBe(true)
		} finally { await destroyApplication(app) }
	})
})
