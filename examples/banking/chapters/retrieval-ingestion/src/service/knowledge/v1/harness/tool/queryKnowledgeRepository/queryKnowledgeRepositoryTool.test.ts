import { describe, expect, it, vi } from 'vitest'
import { queryKnowledgeRepositoryTool } from './queryKnowledgeRepositoryTool.js'

const input = { collectionId: 'customer-help', query: 'pending transfer', limit: 3, embedding: [0.1, 0.2, 0.3, 0.4] }

describe('queryKnowledgeRepositoryTool', () => {
	it('uses trusted tenant identity and the declared embedding profile for the resource query', async () => {
		const search = vi
			.fn()
			.mockResolvedValue([{ documentId: 'transfer-guide', chunkIndex: 0, content: 'Two days.', score: 0.9 }])
		const signal = new AbortController().signal
		await expect(
			queryKnowledgeRepositoryTool.handler(
				{
					identity: { tenantId: 'tenant-example', principalId: 'principal-alex' },
					resources: {
						knowledgeEmbeddingProfile: { model: 'fake-embedding', dimensions: 4 },
						knowledgeRepository: { search },
					},
					signal,
				} as never,
				input,
			),
		).resolves.toEqual({ matches: [{ documentId: 'transfer-guide', chunkIndex: 0, content: 'Two days.', score: 0.9 }] })
		expect(search).toHaveBeenCalledWith({
			tenantId: 'tenant-example',
			collectionId: 'customer-help',
			embeddingModel: 'fake-embedding',
			queryEmbedding: input.embedding,
			limit: 3,
			signal,
		})
	})

	it('rejects missing identity and invalid dimensions before the resource query', async () => {
		const search = vi.fn()
		const value = {
			resources: {
				knowledgeEmbeddingProfile: { model: 'fake-embedding', dimensions: 4 },
				knowledgeRepository: { search },
			},
			signal: new AbortController().signal,
		}
		await expect(
			queryKnowledgeRepositoryTool.handler({ ...value, identity: {} } as never, input),
		).rejects.toMatchObject({ errorCode: 401 })
		await expect(
			queryKnowledgeRepositoryTool.handler({ ...value, identity: { tenantId: 'tenant-example' } } as never, {
				...input,
				embedding: [0.1],
			}),
		).rejects.toMatchObject({ errorCode: 400 })
		expect(search).not.toHaveBeenCalled()
	})
})
