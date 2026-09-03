import { initLogger } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test } from 'vitest'
import { createApplication } from './application.js'
import type { TransactionRepository } from './service/transaction/v1/TransactionRepository.js'

const sandbox = createSandbox()

afterEach(() => sandbox.restore())

async function withApplication(
	repository: TransactionRepository,
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
		await app.eventBridge.destroy()
	}
}

describe('generated transaction endpoints', () => {
	test('rejects invalid input before calling the repository', async () => {
		const save = sandbox.stub()
		const repository: TransactionRepository = { save, findById: sandbox.stub() }
		await withApplication(repository, async app => {
			const response = await app.http.app.request('/api/v1/transactions', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ amountCents: 0, direction: 'debit', counterparty: 'Northwind Books' }),
			})
			expect(response.status).toBe(400)
			expect(response.headers.get('content-type')).toContain('application/problem+json')
			expect(save.called).toBe(false)
		})
	})

	test('returns Problem Details when a transaction is missing', async () => {
		const repository: TransactionRepository = { save: sandbox.stub(), findById: sandbox.stub().resolves(undefined) }
		await withApplication(repository, async app => {
			const id = '3bd00f72-8db0-4f39-875d-fd5e251a7f32'
			const response = await app.http.app.request(`/api/v1/transactions/${id}`)
			expect(response.status).toBe(404)
			expect(await response.json()).toMatchObject({ status: 404, detail: 'Transaction not found' })
		})
	})
})
