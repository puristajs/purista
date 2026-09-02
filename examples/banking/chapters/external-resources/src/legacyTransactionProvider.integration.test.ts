import { initLogger } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test } from 'vitest'
import { createApplication } from './application.js'
import type { ManagedTransactionRepository } from './resources/ManagedTransactionRepository.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

function repository(save = sandbox.stub()): ManagedTransactionRepository {
	return {
		name: 'sqliteTransactionRepository',
		save,
		findById: sandbox.stub(),
		destroy: sandbox.stub().resolves(),
	}
}

async function destroyApplication(app: Awaited<ReturnType<typeof createApplication>>) {
	await app.http.prepareDestroy().destroy()
	await app.http.destroy()
	await app.transaction.destroy()
	await app.identity.destroy()
	await app.bankProfile.destroy()
	await app.identityStateStore.destroy()
	await app.secretStore.destroy()
	await app.transactionRepository.destroy()
	await app.eventBridge.destroy()
}

test('imports through the Compose provider and generated protected endpoint', async () => {
	const saved = {
		accountId: 'account-operating', tenantId: 'tenant-example', transactionId: crypto.randomUUID(),
		amountCents: 2599, direction: 'debit' as const, counterparty: 'Northwind Books', reference: 'Provider 1001',
		recordedAt: new Date().toISOString(),
	}
	const save = sandbox.stub().resolves(saved)
	const app = await createApplication(initLogger('fatal'), repository(save))
	try {
		const login = await app.http.app.request('/api/v1/session/login', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ username: 'alex@example.test', password: 'demo-password' }),
		})
		expect(login.status).toBe(200)
		const { sessionToken } = await login.json() as { sessionToken: string }
		const response = await app.http.app.request(
			'/api/v1/accounts/account-operating/transactions/provider/provider-1001/import',
			{
				method: 'POST',
				headers: {
					authorization: `Bearer ${sessionToken}`,
					'content-type': 'application/json; charset=utf-8',
				},
				body: '{}',
			},
		)

		expect(response.status).toBe(200)
		expect(await response.json()).toEqual(saved)
		expect(save.calledOnceWith({
			accountId: 'account-operating', tenantId: 'tenant-example', amountCents: 2599,
			direction: 'debit', counterparty: 'Northwind Books', reference: 'Provider 1001',
		})).toBe(true)
	} finally {
		await destroyApplication(app)
	}
})
