import { initDefaultStateStore, initLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { createKnowledgeApplication } from './createKnowledgeApplication.js'

async function fixture() {
	const logger = initLogger('fatal')
	const repository = {
		name: 'mockKnowledgeRepository',
		replaceRevision: vi.fn(),
		search: vi.fn(),
		destroy: vi.fn().mockResolvedValue(undefined),
	}
	const provider = new FakeModelProvider({ strict: true })
	const application = await createKnowledgeApplication(logger, {
		stateStore: initDefaultStateStore({ logger }),
		repository,
		models: {
			primary: { provider, model: 'fake-knowledge' },
			embedding: { provider, model: 'fake-embedding' },
		},
		embeddingDimensions: 4,
	})
	return { application, repository, provider }
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
		const { application, repository, provider } = await fixture()
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
			provider.assertExhausted()
		} finally {
			await destroy(application)
		}
	})
})
