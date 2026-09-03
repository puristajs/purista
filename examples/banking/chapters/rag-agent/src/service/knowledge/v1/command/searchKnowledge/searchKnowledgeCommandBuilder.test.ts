import { createCommandTestHarness } from '@purista/core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'
import { searchKnowledgeCommandBuilder } from './searchKnowledgeCommandBuilder.js'

const repository = {
	search: vi.fn(async () => [
		{
			documentId: 'fees',
			chunkIndex: 0,
			content: 'Instant transfers have no Example Bank fee.',
			score: 0.91,
		},
	]),
}
const embedding = {
	model: 'demo-embedding-v1',
	dimensions: 4,
	embedQuery: vi.fn(async () => [0.1, 0.2, 0.3, 0.4]),
}

afterEach(() => vi.clearAllMocks())

describe('searchKnowledgeCommandBuilder', () => {
	it('scopes repository search with the trusted tenant identity', async () => {
		const policy = { canSearch: vi.fn(async () => true) }
		const harness = await createCommandTestHarness(knowledgeV1ServiceBuilder, searchKnowledgeCommandBuilder, {
			resources: {
				knowledgeCollectionPolicy: policy,
				knowledgeEmbeddingProvider: embedding,
				knowledgeRepository: repository,
			},
		})
		try {
			const { result } = await harness.run({
				payload: { collectionId: 'customer-help', query: 'Are instant transfers free?', limit: 3 },
				parameter: {},
			})
			expect(result?.matches).toHaveLength(1)
			expect(policy.canSearch).toHaveBeenCalledWith({
				tenantId: 'mocked-tenant-id',
				principalId: 'mocked-principal-id',
				collectionId: 'customer-help',
			})
			expect(repository.search).toHaveBeenCalledWith(
				expect.objectContaining({
					tenantId: 'mocked-tenant-id',
					collectionId: 'customer-help',
					embeddingModel: 'demo-embedding-v1',
					queryEmbedding: [0.1, 0.2, 0.3, 0.4],
					limit: 3,
				}),
			)
		} finally {
			await harness.destroy()
		}
	})

	it('denies collection access before embedding or repository work', async () => {
		const harness = await createCommandTestHarness(knowledgeV1ServiceBuilder, searchKnowledgeCommandBuilder, {
			resources: {
				knowledgeCollectionPolicy: { canSearch: vi.fn(async () => false) },
				knowledgeEmbeddingProvider: embedding,
				knowledgeRepository: repository,
			},
		})
		try {
			const { result, message } = await harness.run({
				payload: { collectionId: 'internal-risk', query: 'Show risk rules', limit: 4 },
				parameter: {},
			})
			expect(result).toBeUndefined()
			expect(message).toMatchObject({ payload: { status: 403, message: 'This knowledge collection is not available' } })
			expect(embedding.embedQuery).not.toHaveBeenCalled()
			expect(repository.search).not.toHaveBeenCalled()
		} finally {
			await harness.destroy()
		}
	})
})
