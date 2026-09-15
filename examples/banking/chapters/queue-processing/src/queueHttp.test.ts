import { initLogger } from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import { createApplication } from './application.js'
import type { ManagedTransactionRepository } from './resources/ManagedTransactionRepository.js'

const sandbox = createSandbox()
const transactionId = '3bd00f72-8db0-4f39-875d-fd5e251a7f32'
const stored = {
	transactionId, amountCents: 2599, direction: 'debit' as const,
	counterparty: 'Northwind Books', recordedAt: '2026-09-01T10:00:00.000Z',
}

function repository(): ManagedTransactionRepository {
	return {
		name: 'sqliteTransactionRepository',
		save: sandbox.stub(),
		findById: sandbox.stub().withArgs(transactionId).resolves(stored),
		destroy: sandbox.stub().resolves(),
	}
}

async function destroyApplication(app: Awaited<ReturnType<typeof createApplication>>) {
	await app.http.prepareDestroy().destroy()
	await app.http.destroy()
	await app.reporting.destroy()
	await app.transaction.destroy()
	await app.identity.destroy()
	await app.bankProfile.destroy()
	await app.reportingStateStore.destroy()
	await app.identityStateStore.destroy()
	await app.queueBridge.destroy()
	await app.transactionRepository.destroy()
	await app.eventBridge.destroy()
}

async function login(app: Awaited<ReturnType<typeof createApplication>>) {
	const response = await app.http.app.request('/api/v1/session/login', {
		method: 'POST', headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ username: 'alex@example.test', password: 'demo-password' }),
	})
	return (await response.json()) as { sessionToken: string }
}

test('accepts a protected job and returns its stored result', async () => {
	const app = await createApplication(initLogger('fatal'), repository())
	try {
		const { sessionToken } = await login(app)
		const headers = { authorization: `Bearer ${sessionToken}`, 'content-type': 'application/json' }
		const accepted = await app.http.app.request('/api/v1/reports/statements', {
			method: 'POST', headers,
			body: JSON.stringify({ accountId: 'account-operating', transactionId }),
		})
		expect(accepted.status).toBe(202)
		const receipt = await accepted.json() as { jobId: string; queueName: string }
		expect(receipt.queueName).toBe('generateStatement')

		let status: Response | undefined
		for (let attempt = 0; attempt < 20; attempt += 1) {
			status = await app.http.app.request(`/api/v1/reports/statements/${receipt.jobId}`, { headers })
			if (status.status === 200) break
			await new Promise(resolve => setTimeout(resolve, 25))
		}
		expect(status?.status).toBe(200)
		await expect(status?.json()).resolves.toMatchObject({
			jobId: receipt.jobId,
			status: 'success',
			statement: { accountId: 'account-operating', transactionId, amountCents: 2599 },
		})
	} finally { await destroyApplication(app); sandbox.restore() }
})

test('does not accept caller-supplied identity fields', async () => {
	const app = await createApplication(initLogger('fatal'), repository())
	try {
		const { sessionToken } = await login(app)
		const response = await app.http.app.request('/api/v1/reports/statements', {
			method: 'POST',
			headers: { authorization: `Bearer ${sessionToken}`, 'content-type': 'application/json' },
			body: JSON.stringify({
				accountId: 'account-operating', transactionId,
				principalId: 'principal-other', tenantId: 'tenant-other',
			}),
		})
		expect(response.status).toBe(400)
	} finally { await destroyApplication(app); sandbox.restore() }
})
