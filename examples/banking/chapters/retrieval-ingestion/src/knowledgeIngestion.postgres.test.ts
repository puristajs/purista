import {
	DefaultQueueBridge,
	initDefaultStateStore,
	initLogger,
} from '@purista/core'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { createKnowledgeApplication } from './knowledgeApplication.js'
import { PgKnowledgeRepository } from './resources/PgKnowledgeRepository.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'
import type { LocalIdentityProvider } from './service/identity/v1/LocalIdentityProvider.js'
import { deterministicKnowledgeEmbeddingProvider } from './service/knowledge/v1/DeterministicKnowledgeEmbeddingProvider.js'
import {
	localKnowledgeCollectionPolicy,
	type KnowledgeCollectionPolicy,
} from './service/knowledge/v1/KnowledgeCollectionPolicy.js'
import { demoEmbeddingModel } from './service/knowledge/v1/KnowledgeResources.js'

function requiredDatabaseUrl() {
	const value = process.env.DATABASE_URL
	if (!value) throw new Error('DATABASE_URL is required for PostgreSQL tests')
	return value
}

const databaseUrl = requiredDatabaseUrl()

const applications: Array<Awaited<ReturnType<typeof createKnowledgeApplication>>> = []

afterEach(async () => {
	for (const app of applications.splice(0).reverse()) {
		await app.http.prepareDestroy().destroy()
		await app.http.destroy()
		await app.knowledge.destroy()
		await app.transaction.destroy()
		await app.identity.destroy()
		await app.bankProfile.destroy()
		await app.knowledgeStateStore.destroy()
		await app.identityStateStore.destroy()
		await app.queueBridge.destroy()
		await app.knowledgeRepository.destroy()
		await app.transactionRepository.destroy()
		await app.eventBridge.destroy()
	}
})

async function application(principalId = 'principal-alex') {
	const logger = initLogger('fatal')
	const transactionRepository = new SqliteTransactionRepository(':memory:')
	const identityStateStore = initDefaultStateStore({ logger })
	const knowledgeStateStore = initDefaultStateStore({ logger })
	const queueBridge = new DefaultQueueBridge({ maxAttempts: 3 })
	const knowledgeRepository = new PgKnowledgeRepository(databaseUrl)
	const identityProvider: LocalIdentityProvider = {
		authenticate: vi.fn().mockResolvedValue({
			principalId,
			tenantId: 'tenant-example',
			displayName: 'Tutorial user',
		}),
	}
	const collectionPolicy: KnowledgeCollectionPolicy = localKnowledgeCollectionPolicy
	const app = await createKnowledgeApplication(logger, {
		transactionRepository,
		identityProvider,
		identityStateStore,
		queueBridge,
		knowledgeStateStore,
		knowledgeCollectionPolicy: collectionPolicy,
		knowledgeEmbeddingProvider: deterministicKnowledgeEmbeddingProvider,
		knowledgeRepository,
	})
	applications.push(app)
	return app
}

async function login(app: Awaited<ReturnType<typeof createKnowledgeApplication>>) {
	const response = await app.http.app.request('/api/v1/session/login', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ username: 'tutorial@example.test', password: 'test-password' }),
	})
	expect(response.status).toBe(200)
	return (await response.json()) as { sessionToken: string }
}

async function ingestionRequest(
	app: Awaited<ReturnType<typeof createKnowledgeApplication>>,
	collectionId: string,
	documentId: string,
	token?: string,
) {
	return app.http.app.request(`/api/v1/knowledge/collections/${collectionId}/revisions`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			...(token ? { authorization: `Bearer ${token}` } : {}),
		},
		body: JSON.stringify({
			documentId,
			revision: 1,
			title: 'Card help',
			content: 'Lock a lost card in the app. Contact support for a replacement.',
			embeddingModel: demoEmbeddingModel,
		}),
	})
}

async function waitForDocument(
	app: Awaited<ReturnType<typeof createKnowledgeApplication>>,
	documentId: string,
) {
	const [queryEmbedding] = await deterministicKnowledgeEmbeddingProvider.embed({
		texts: ['lost card replacement'],
		model: demoEmbeddingModel,
		signal: new AbortController().signal,
	})
	for (let attempt = 0; attempt < 50; attempt += 1) {
		const results = await app.knowledgeRepository.search({
			tenantId: 'tenant-example',
			collectionId: 'policy-help',
			embeddingModel: demoEmbeddingModel,
			queryEmbedding: queryEmbedding!,
			limit: 10,
		})
		const match = results.find(result => result.documentId === documentId)
		if (match) return match
		await new Promise(resolve => setTimeout(resolve, 20))
	}
	throw new Error('Timed out while waiting for the ingestion worker')
}

describe('knowledge ingestion application', () => {
	test('protects the endpoint, applies collection policy, and stores accepted work', async () => {
		const anonymousApp = await application()
		const anonymous = await ingestionRequest(anonymousApp, 'policy-help', crypto.randomUUID())
		expect(anonymous.status).toBe(401)

		const deniedApp = await application('principal-sam')
		const deniedToken = await login(deniedApp)
		const denied = await ingestionRequest(
			deniedApp,
			'policy-help',
			crypto.randomUUID(),
			deniedToken.sessionToken,
		)
		expect(denied.status).toBe(403)

		const allowedApp = await application()
		const allowedToken = await login(allowedApp)
		const documentId = crypto.randomUUID()
		const accepted = await ingestionRequest(
			allowedApp,
			'policy-help',
			documentId,
			allowedToken.sessionToken,
		)
		expect(accepted.status).toBe(202)
		expect(await accepted.json()).toMatchObject({ queueName: 'ingestKnowledge' })

		await expect(waitForDocument(allowedApp, documentId)).resolves.toMatchObject({
			documentId,
			revision: 1,
			content: 'Lock a lost card in the app. Contact support for a replacement.',
		})
	})
})
