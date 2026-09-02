import { initLogger } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test } from 'vitest'
import { createApplication } from './application.js'
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

describe('generated transaction endpoints', () => {
	test('rejects invalid input before calling the repository', async () => {
		const save = sandbox.stub()
		await withApplication(managedFake({ save }), async app => {
			const response = await app.http.app.request('/api/v1/transactions', {
				method: 'POST', headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ amountCents: 0, direction: 'debit', counterparty: 'Northwind Books' }),
			})
			expect(response.status).toBe(400)
			expect(save.called).toBe(false)
		})
	})

	test('returns Problem Details when a transaction is missing', async () => {
		await withApplication(managedFake({ findById: sandbox.stub().resolves(undefined) }), async app => {
			const response = await app.http.app.request('/api/v1/transactions/3bd00f72-8db0-4f39-875d-fd5e251a7f32')
			expect(response.status).toBe(404)
			expect(await response.json()).toMatchObject({ status: 404, detail: 'Transaction not found' })
		})
	})

	test('records and reads through real SQLite and generated endpoints', async () => {
		await withApplication(new SqliteTransactionRepository(':memory:'), async app => {
			const recordedResponse = await app.http.app.request('/api/v1/transactions', {
				method: 'POST', headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ amountCents: 2599, direction: 'debit', counterparty: 'Northwind Books' }),
			})
			expect(recordedResponse.status).toBe(200)
			const recorded = (await recordedResponse.json()) as { transactionId: string }

			const readResponse = await app.http.app.request(`/api/v1/transactions/${recorded.transactionId}`)
			expect(readResponse.status).toBe(200)
			expect(await readResponse.json()).toMatchObject({
				transactionId: recorded.transactionId,
				amountCents: 2599,
				counterparty: 'Northwind Books',
			})
		})
	})
})
