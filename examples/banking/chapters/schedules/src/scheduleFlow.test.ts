import { getQueueBridgeMock, initLogger } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, expect, test } from 'vitest'
import { createApplication } from './application.js'
import type { ManagedTransactionRepository } from './resources/ManagedTransactionRepository.js'
import { dailyStatementDueEventName } from './service/reporting/v1/schedule/dailyStatementOccurrence.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

const occurrence = {
	id: 'daily:2026-09-02:account-operating',
	scheduledFor: '2026-09-02T04:00:00.000Z',
	accountId: 'account-operating',
	transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
}

function repository(): ManagedTransactionRepository {
	return {
		name: 'sqliteTransactionRepository',
		save: sandbox.stub(),
		findById: sandbox.stub(),
		destroy: sandbox.stub().resolves(),
	}
}

async function destroyApplication(app: Awaited<ReturnType<typeof createApplication>>) {
	await new Promise<void>(resolve => setImmediate(resolve))
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
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ username: 'alex@example.test', password: 'demo-password' }),
	})
	expect(response.status).toBe(200)
	return (await response.json()) as { sessionToken: string }
}

async function waitForCalls(callCount: () => number, expected: number) {
	for (let attempt = 0; attempt < 20 && callCount() < expected; attempt += 1) {
		await new Promise(resolve => setTimeout(resolve, 10))
	}
	expect(callCount()).toBe(expected)
}

test('routes a protected fixed occurrence to QueueBridge', async () => {
	const queueBridge = getQueueBridgeMock(sandbox)
	const app = await createApplication(initLogger('fatal'), repository(), undefined, undefined, queueBridge.mock)
	try {
		const { sessionToken } = await login(app)
		const response = await app.http.app.request('/api/v1/reports/statements/daily-trigger', {
			method: 'POST',
			headers: {
				authorization: `Bearer ${sessionToken}`,
				'content-type': 'application/json',
			},
			body: JSON.stringify(occurrence),
		})

		expect(response.status).toBe(200)
		await expect(response.json()).resolves.toEqual({ occurrenceId: occurrence.id })
		await waitForCalls(() => queueBridge.stubs.enqueue.callCount, 1)
		expect(queueBridge.stubs.enqueue.firstCall.args[0]).toMatchObject({
			queueName: 'generateStatement',
			payload: {
				accountId: occurrence.accountId,
				transactionId: occurrence.transactionId,
			},
			idempotencyKey: occurrence.id,
			headers: {
				'purista.principalId': 'principal-alex',
				'purista.tenantId': 'tenant-example',
				'purista.sourceEventName': dailyStatementDueEventName,
			},
		})
	} finally {
		await destroyApplication(app)
	}
})

test('makes repeated occurrence delivery explicit', async () => {
	const queueBridge = getQueueBridgeMock(sandbox)
	const app = await createApplication(initLogger('fatal'), repository(), undefined, undefined, queueBridge.mock)
	try {
		const { sessionToken } = await login(app)
		const request = () => app.http.app.request('/api/v1/reports/statements/daily-trigger', {
			method: 'POST',
			headers: {
				authorization: `Bearer ${sessionToken}`,
				'content-type': 'application/json',
			},
			body: JSON.stringify(occurrence),
		})
		expect((await request()).status).toBe(200)
		expect((await request()).status).toBe(200)
		await waitForCalls(() => queueBridge.stubs.enqueue.callCount, 2)
		expect(queueBridge.stubs.enqueue.firstCall.args[0].idempotencyKey).toBe(occurrence.id)
		expect(queueBridge.stubs.enqueue.secondCall.args[0].idempotencyKey).toBe(occurrence.id)
	} finally {
		await destroyApplication(app)
	}
})
