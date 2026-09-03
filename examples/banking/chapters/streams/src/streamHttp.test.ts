import { initDefaultStateStore, initLogger } from '@purista/core'
import { expect, test } from 'vitest'
import { createApplication } from './application.js'
import type { ManagedTransactionRepository } from './resources/ManagedTransactionRepository.js'
import type { TransactionAnalysisReader } from './service/analysis/v1/TransactionAnalysisReader.js'

function transactionRepository(): ManagedTransactionRepository {
	return {
		name: 'sqliteTransactionRepository',
		save: async input => ({ ...input, transactionId: crypto.randomUUID(), recordedAt: new Date().toISOString() }),
		findById: async () => undefined,
		destroy: async () => {},
	}
}

async function destroyApplication(app: Awaited<ReturnType<typeof createApplication>>) {
	await app.http.prepareDestroy().destroy()
	await app.http.destroy()
	await app.analysis.destroy()
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
	return (await response.json() as { sessionToken: string }).sessionToken
}

const rows = [
	{ transactionId: '4cb54a52-0416-41b1-acbc-9be2aa4a19d2', amountCents: 2_500,
		direction: 'debit' as const, counterparty: 'Northwind Books', recordedAt: '2026-01-03T10:00:00.000Z' },
	{ transactionId: 'e4fd9d5c-fe60-41b4-8958-d61981857ee0', amountCents: 8_000,
		direction: 'credit' as const, counterparty: 'Example Payroll', recordedAt: '2026-01-02T10:00:00.000Z' },
]

test('protects the generated route and sends the summary as the last chunk', async () => {
	const analysisReader: TransactionAnalysisReader = {
		canReadAccount: async () => true,
		listRecent: async () => rows,
	}
	const stateStore = initDefaultStateStore({ logger: initLogger('fatal') })
	const app = await createApplication(
		initLogger('fatal'), transactionRepository(), undefined, stateStore, analysisReader,
	)
	try {
		const path = '/api/v1/analysis/accounts/account-operating/transactions'
		expect((await app.http.app.request(path)).status).toBe(401)
		const sessionToken = await login(app)
		const response = await app.http.app.request(path, {
			headers: { authorization: `Bearer ${sessionToken}` },
		})
		expect(response.status).toBe(200)
		expect(response.headers.get('content-type')).toContain('text/event-stream')
		const body = await response.text()
		expect(body).toContain('event: chunk')
		expect(body).toContain('"stage":"loading"')
		expect(body).toContain('"stage":"complete"')
		expect(body).toContain('"netCents":5500')
	} finally {
		await destroyApplication(app)
	}
})
