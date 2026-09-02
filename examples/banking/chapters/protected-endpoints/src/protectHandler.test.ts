import { initLogger } from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import { createApplication } from './application.js'
import { DEMO_API_KEY } from './demoProtectMiddleware.js'
import type { ManagedTransactionRepository } from './resources/ManagedTransactionRepository.js'

test('protects generated transaction endpoints and propagates trusted identity metadata', async () => {
	const sandbox = createSandbox()
	const stored = {
		transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
		amountCents: 2599,
		direction: 'debit' as const,
		counterparty: 'Northwind Books',
		recordedAt: '2026-09-01T10:00:00.000Z',
	}
	const save = sandbox.stub().resolves(stored)
	const repository: ManagedTransactionRepository = {
		name: 'sqliteTransactionRepository',
		save,
		findById: sandbox.stub(),
		destroy: sandbox.stub().resolves(),
	}
	const app = await createApplication(initLogger('fatal'), repository)

	try {
		const profile = await app.http.app.request('/api/v1/profile')
		expect(profile.status).toBe(200)
		await profile.json()

		const denied = await app.http.app.request('/api/v1/transactions', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ amountCents: 2599, direction: 'debit', counterparty: 'Northwind Books' }),
		})
		expect(denied.status).toBe(401)
		await denied.json()
		expect(save.called).toBe(false)

		const allowed = await app.http.app.request('/api/v1/transactions', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				authorization: `Bearer ${DEMO_API_KEY}`,
			},
			body: JSON.stringify({ amountCents: 2599, direction: 'debit', counterparty: 'Northwind Books' }),
		})
		expect(allowed.status).toBe(200)
		await allowed.json()
		expect(save.calledOnce).toBe(true)

		const openApiResponse = await app.http.app.request('/api/openapi.json')
		const openApi = (await openApiResponse.json()) as {
			paths: Record<string, Record<string, { security?: unknown; 'x-purista-endpoint-security'?: string }>>
		}
		expect(openApi.paths['/api/v1/profile'].get.security).toEqual([])
		expect(openApi.paths['/api/v1/transactions'].post.security).toEqual([{ demoBearer: [] }])
		expect(openApi.paths['/api/v1/transactions'].post['x-purista-endpoint-security'])
			.toBe('protected-with-security-scheme')
	} finally {
		await app.http.prepareDestroy().destroy()
		await app.http.destroy()
		await app.transaction.destroy()
		await app.bankProfile.destroy()
		await app.transactionRepository.destroy()
		await app.eventBridge.destroy()
		sandbox.restore()
	}
})
