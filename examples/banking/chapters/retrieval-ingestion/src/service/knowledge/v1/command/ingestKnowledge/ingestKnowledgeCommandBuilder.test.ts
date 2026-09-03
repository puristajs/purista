import { createCommandTestHarness } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { knowledgeV1Service } from '../../knowledgeV1Service.js'
import { ingestKnowledgeCommandBuilder } from './ingestKnowledgeCommandBuilder.js'

const repository = { replaceRevision: vi.fn().mockResolvedValue(undefined), search: vi.fn() }

afterEach(() => vi.clearAllMocks())

describe('ingestKnowledgeCommandBuilder', () => {
	it('uses the Harness embedding model and stores the vectors through the repository resource', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueEmbedding({
			embeddings: [{ index: 0, vector: [0.1, 0.2, 0.3, 0.4] }],
			usage: { inputTokens: 8, outputTokens: 0, totalTokens: 8 },
		})
		const policy = { canAccess: vi.fn(async () => true) }
		const harness = await createCommandTestHarness(knowledgeV1Service, ingestKnowledgeCommandBuilder, {
			serviceConfig: { embeddingModel: 'fake-embedding', embeddingDimensions: 4 },
			resources: { knowledgeCollectionPolicy: policy, knowledgeRepository: repository },
			ai: {
				models: {
					primary: { provider, model: 'fake-chat' },
					embedding: { provider, model: 'fake-embedding' },
				},
			},
		})

		try {
			await harness.service.start()
			const { result } = await harness.run({
				payload: {
					collectionId: 'customer-help',
					documentId: 'transfer-guide',
					revision: 1,
					title: 'International transfer timing',
					content: 'International transfers can remain pending for two business days.',
				},
				parameter: {},
			})

			expect(result).toEqual({
				documentId: 'transfer-guide',
				revision: 1,
				chunkCount: 1,
				embeddingModel: 'fake-embedding',
			})
			expect(policy.canAccess).toHaveBeenCalledWith({
				tenantId: 'mocked-tenant-id',
				principalId: 'mocked-principal-id',
				collectionId: 'customer-help',
				action: 'edit',
			})
			expect(repository.replaceRevision).toHaveBeenCalledWith(
				expect.objectContaining({
					tenantId: 'mocked-tenant-id',
					embeddingModel: 'fake-embedding',
					chunks: [expect.objectContaining({ embedding: [0.1, 0.2, 0.3, 0.4] })],
				}),
				expect.any(AbortSignal),
			)
			provider.assertExhausted()
		} finally {
			await harness.destroy()
		}
	})

	it('denies collection edits before model or repository work', async () => {
		const provider = new FakeModelProvider({ strict: true })
		const harness = await createCommandTestHarness(knowledgeV1Service, ingestKnowledgeCommandBuilder, {
			serviceConfig: { embeddingModel: 'fake-embedding', embeddingDimensions: 4 },
			resources: {
				knowledgeCollectionPolicy: { canAccess: async () => false },
				knowledgeRepository: repository,
			},
			ai: {
				models: {
					primary: { provider, model: 'fake-chat' },
					embedding: { provider, model: 'fake-embedding' },
				},
			},
		})

		try {
			await harness.service.start()
			const { result, message } = await harness.run({
				payload: {
					collectionId: 'internal-risk',
					documentId: 'secret-policy',
					revision: 1,
					title: 'Internal policy',
					content: 'This source must not be indexed by this caller.',
				},
				parameter: {},
			})

			expect(result).toBeUndefined()
			expect(message).toMatchObject({ payload: { status: 403, message: 'This knowledge collection is not available' } })
			provider.assertExhausted()
			expect(repository.replaceRevision).not.toHaveBeenCalled()
		} finally {
			await harness.destroy()
		}
	})
})
