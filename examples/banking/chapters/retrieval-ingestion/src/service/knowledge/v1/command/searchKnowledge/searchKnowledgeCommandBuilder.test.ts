import { createCommandTestHarness } from '@purista/core'
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
	return {
		serviceConfig: { embeddingModel: 'fake-embedding', embeddingDimensions: 4 },
		resources: { knowledgeCollectionPolicy: policy, knowledgeRepository: repository },
		ai: {
			models: {
				primary: { provider, model: 'fake-chat' },
				embedding: { provider, model: 'fake-embedding' },
			},
		},
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
		const harness = await createCommandTestHarness(knowledgeV1Service, searchKnowledgeCommandBuilder, {
			...options(policy, provider),
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
			await harness.destroy()
		}
	})

	it('denies collection access before embedding or repository work', async () => {
		const provider = new FakeModelProvider({ strict: true })
		const canAccess = vi.fn(async (_input: Parameters<KnowledgeCollectionPolicy['canAccess']>[0]) => false)
		const harness = await createCommandTestHarness(knowledgeV1Service, searchKnowledgeCommandBuilder, {
			...options({ canAccess }, provider),
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
			await harness.destroy()
		}
	})
})
