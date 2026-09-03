import { initDefaultStateStore, initLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { createKnowledgeApplication } from './createKnowledgeApplication.js'

async function fixture() {
	const logger = initLogger('fatal')
	const repository = { name: 'mockKnowledgeRepository', search: vi.fn(), destroy: vi.fn().mockResolvedValue(undefined) }
	const embeddingProvider = { model: 'demo-embedding-v1', dimensions: 4, embedQuery: vi.fn() }
	const application = await createKnowledgeApplication(logger, {
		stateStore: initDefaultStateStore({ logger }),
		repository,
		embeddingProvider,
		model: { provider: new FakeModelProvider({ strict: true }), model: 'fake-knowledge' },
	})
	return { application, repository, embeddingProvider }
}

async function destroy(application: Awaited<ReturnType<typeof createKnowledgeApplication>>) {
	await new Promise<void>((resolve) => setImmediate(resolve))
	await application.http.prepareDestroy().destroy()
	await application.http.destroy()
	await application.knowledge.destroy()
	await application.identity.destroy()
	await application.repository.destroy()
	await application.stateStore.destroy()
	await application.eventBridge.destroy()
}

describe('knowledge HTTP application', () => {
	it('keeps login public and blocks the protected stream before retrieval', async () => {
		const { application, repository, embeddingProvider } = await fixture()
		try {
			const login = await application.http.app.request('/api/v1/session/login', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ username: 'alex@example.test', password: 'demo-password' }),
			})
			expect(login.status).toBe(200)
			expect(await login.json()).toMatchObject({ displayName: 'Alex Example' })

			const denied = await application.http.app.request('/api/v1/knowledge/chat', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					'x-tenant-id': 'tenant-example',
					'x-principal-id': 'principal-alex',
				},
				body: JSON.stringify({
					id: 'chat-1',
					collectionId: 'customer-help',
					messages: [{ role: 'user', parts: [{ type: 'text', text: 'How long are transfers pending?' }] }],
				}),
			})
			expect(denied.status).toBe(401)
			expect(repository.search).not.toHaveBeenCalled()
			expect(embeddingProvider.embedQuery).not.toHaveBeenCalled()
		} finally {
			await destroy(application)
		}
	})
})
