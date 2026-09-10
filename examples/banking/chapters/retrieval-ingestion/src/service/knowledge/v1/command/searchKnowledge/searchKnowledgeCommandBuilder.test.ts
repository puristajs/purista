import { createCommandTestHarness, DefaultEventBridge } from '@purista/core'
import { sqliteHarnessStorage } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { KnowledgeCollectionPolicy } from '../../KnowledgeResources.js'
import { knowledgeV1Service } from '../../knowledgeV1Service.js'
import { searchKnowledgeCommandBuilder } from './searchKnowledgeCommandBuilder.js'

const repository = {
	replaceRevision: vi.fn(),
	search: vi.fn(async () => [
		{
			documentId: 'fees',
			chunkIndex: 0,
			content: 'Instant transfers have no Example Bank fee.',
			score: 0.91,
		},
	]),
}

function options(policy: KnowledgeCollectionPolicy, provider: FakeModelProvider) {
	const storage = sqliteHarnessStorage({ file: ':memory:' })
	return {
		serviceConfig: { embeddingModel: 'fake-embedding', embeddingDimensions: 4 },
		resources: {
			knowledgeCollectionPolicy: policy,
			knowledgeEmbeddingProfile: { model: 'fake-embedding', dimensions: 4 },
			knowledgeRepository: repository,
		},
		ai: {
			storage,
			model: { provider, model: 'fake-chat' },
			models: {
				embedding: { provider, model: 'fake-embedding' },
			},
		},
		storage,
	}
}

afterEach(() => vi.clearAllMocks())

describe('searchKnowledgeCommandBuilder', () => {
	it('scopes repository search with the trusted tenant identity', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueEmbedding({
			embeddings: [{ index: 0, vector: [0.1, 0.2, 0.3, 0.4] }],
			usage: { inputTokens: 3, outputTokens: 0, totalTokens: 3 },
		})
		const canAccess = vi.fn(async (_input: Parameters<KnowledgeCollectionPolicy['canAccess']>[0]) => true)
		const policy = { canAccess }
		const runtime = options(policy, provider)
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const harness = await createCommandTestHarness(knowledgeV1Service, searchKnowledgeCommandBuilder, {
			...runtime,
			eventBridge,
		})
		try {
			await harness.service.start()
			const { result } = await harness.run({
				payload: { collectionId: 'customer-help', query: 'Are instant transfers free?', limit: 3 },
				parameter: {},
			})
			expect(result?.matches).toHaveLength(1)
			expect(canAccess).toHaveBeenCalledWith({
				tenantId: 'mocked-tenant-id',
				principalId: 'mocked-principal-id',
				collectionId: 'customer-help',
				action: 'search',
			})
			expect(repository.search).toHaveBeenCalledWith(
				expect.objectContaining({
					tenantId: 'mocked-tenant-id',
					collectionId: 'customer-help',
					embeddingModel: 'fake-embedding',
					queryEmbedding: [0.1, 0.2, 0.3, 0.4],
					limit: 3,
				}),
			)
			provider.assertExhausted()
		} finally {
			await new Promise<void>((resolve) => setImmediate(resolve))
			await harness.destroy()
			await eventBridge.destroy()
			await runtime.storage.close()
		}
	})

	it('denies collection access before embedding or repository work', async () => {
		const provider = new FakeModelProvider({ strict: true })
		const canAccess = vi.fn(async (_input: Parameters<KnowledgeCollectionPolicy['canAccess']>[0]) => false)
		const runtime = options({ canAccess }, provider)
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const harness = await createCommandTestHarness(knowledgeV1Service, searchKnowledgeCommandBuilder, {
			...runtime,
			eventBridge,
		})
		try {
			await harness.service.start()
			const { result, message } = await harness.run({
				payload: { collectionId: 'internal-risk', query: 'Show risk rules', limit: 4 },
				parameter: {},
			})
			expect(result).toBeUndefined()
			expect(message).toMatchObject({ payload: { status: 403, message: 'This knowledge collection is not available' } })
			provider.assertExhausted()
			expect(repository.search).not.toHaveBeenCalled()
		} finally {
			await new Promise<void>((resolve) => setImmediate(resolve))
			await harness.destroy()
			await eventBridge.destroy()
			await runtime.storage.close()
		}
	})
})
