import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { BaseModelProvider, ModelError, sqliteHarnessStorage } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { runIngestKnowledgeCommandBuilder } from './service/knowledge/v1/command/runIngestKnowledge/runIngestKnowledgeCommandBuilder.js'
import { knowledgeHarness, knowledgeHarnessPolicy } from './service/knowledge/v1/harness/knowledgeHarness.js'
import { knowledgeV1ServiceBuilder } from './service/knowledge/v1/knowledgeV1ServiceBuilder.js'

const ingestionService = knowledgeV1ServiceBuilder
	.addCommandDefinition(runIngestKnowledgeCommandBuilder.getDefinition())
	.mountHarness(knowledgeHarness, knowledgeHarnessPolicy)

class RetryEmbeddingProvider extends BaseModelProvider {
	public declare readonly embed: NonNullable<BaseModelProvider['embed']>
	private readonly fake = new FakeModelProvider({ strict: true })
	public attempts = 0

	public constructor() {
		super({ id: 'retry-embedding', genAiSystem: 'fake' })
	}

	public enqueueEmbedding(response: import('@purista/harness').EmbeddingResponse) {
		this.fake.enqueueEmbedding(response)
	}

	protected override async doEmbed(
		request: import('@purista/harness').EmbeddingRequest,
	): Promise<import('@purista/harness').EmbeddingResponse> {
		this.attempts += 1
		if (this.attempts === 1) {
			throw new ModelError('Temporary embedding outage.', {
				provider: 'fake',
				model: 'fake-embedding',
				method: 'embed',
				status: 503,
			})
		}
		return this.fake.embed(request)
	}
}

describe('knowledge ingestion workflow', () => {
	it('runs the mounted workflow through EventBridge and persists trusted tenant data', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueEmbedding({
			embeddings: [
				{ index: 0, vector: [0.1, 0.2] },
				{ index: 1, vector: [0.3, 0.4] },
			],
			usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
		})
		const repository = { replaceRevision: vi.fn().mockResolvedValue(undefined), search: vi.fn() }
		const policy = { canAccess: vi.fn().mockResolvedValue(true) }
		const eventBridge = new DefaultEventBridge()
		const storage = sqliteHarnessStorage({ file: ':memory:' })
		await eventBridge.start()
		const service = await ingestionService.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			serviceConfig: { embeddingModel: 'fake-embedding', embeddingDimensions: 2 },
			resources: {
				knowledgeCollectionPolicy: policy,
				knowledgeEmbeddingProfile: { model: 'fake-embedding', dimensions: 2 },
				knowledgeRepository: repository,
			},
			ai: {
				storage,
				model: { provider, model: 'fake-chat' },
				models: { embedding: { provider, model: 'fake-embedding' } },
			},
		})
		await service.start()
		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-alex',
						receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'runIngestKnowledge' },
						payload: {
							payload: {
								collectionId: 'customer-help',
								documentId: 'doc-1',
								revision: 1,
								title: 'Policy',
								content: Array.from({ length: 81 }, (_, index) => `word-${index}`).join(' '),
							},
							parameter: {},
						},
					}),
				),
			).resolves.toMatchObject({ documentId: 'doc-1', chunkCount: 2, embeddingModel: 'fake-embedding' })
			expect(provider.requests[0]).toMatchObject({
				input: [Array.from({ length: 80 }, (_, index) => `word-${index}`).join(' '), 'word-80'],
			})
			expect(repository.replaceRevision).toHaveBeenCalledWith(
				expect.objectContaining({
					tenantId: 'tenant-example',
					embeddingModel: 'fake-embedding',
					chunks: [
						expect.objectContaining({ index: 0, content: expect.stringContaining('word-0'), embedding: [0.1, 0.2] }),
						expect.objectContaining({ index: 1, content: 'word-80', embedding: [0.3, 0.4] }),
					],
				}),
				expect.any(AbortSignal),
			)
			provider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
			await storage.close()
		}
	})

	it('denies before model or persistence effects', async () => {
		const provider = new FakeModelProvider({ strict: true })
		const repository = { replaceRevision: vi.fn(), search: vi.fn() }
		const policy = { canAccess: vi.fn().mockResolvedValue(false) }
		const eventBridge = new DefaultEventBridge()
		const storage = sqliteHarnessStorage({ file: ':memory:' })
		await eventBridge.start()
		const service = await ingestionService.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			serviceConfig: { embeddingModel: 'fake-embedding', embeddingDimensions: 2 },
			resources: {
				knowledgeCollectionPolicy: policy,
				knowledgeEmbeddingProfile: { model: 'fake-embedding', dimensions: 2 },
				knowledgeRepository: repository,
			},
			ai: {
				storage,
				model: { provider, model: 'fake-chat' },
				models: { embedding: { provider, model: 'fake-embedding' } },
			},
		})
		await service.start()
		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-alex',
						receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'runIngestKnowledge' },
						payload: {
							payload: {
								collectionId: 'customer-help',
								documentId: 'doc-1',
								revision: 1,
								title: 'Policy',
								content: 'one',
							},
							parameter: {},
						},
					}),
				),
			).rejects.toMatchObject({ errorCode: 403 })
			expect(provider.requests).toHaveLength(0)
			expect(repository.replaceRevision).not.toHaveBeenCalled()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
			await storage.close()
		}
	})

	it('fails closed when the mounted guard or vectors are invalid', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueEmbedding({
			embeddings: [{ index: 0, vector: [0.1] }],
			usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
		})
		const repository = { replaceRevision: vi.fn(), search: vi.fn() }
		const policy = { canAccess: vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false) }
		const eventBridge = new DefaultEventBridge()
		const storage = sqliteHarnessStorage({ file: ':memory:' })
		await eventBridge.start()
		const service = await ingestionService.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			serviceConfig: { embeddingModel: 'fake-embedding', embeddingDimensions: 2 },
			resources: {
				knowledgeCollectionPolicy: policy,
				knowledgeEmbeddingProfile: { model: 'fake-embedding', dimensions: 2 },
				knowledgeRepository: repository,
			},
			ai: {
				storage,
				model: { provider, model: 'fake-chat' },
				models: { embedding: { provider, model: 'fake-embedding' } },
			},
		})
		await service.start()
		try {
			const message = getCommandMessageMock({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'runIngestKnowledge' },
				payload: {
					payload: { collectionId: 'customer-help', documentId: 'doc-1', revision: 1, title: 'Policy', content: 'one' },
					parameter: {},
				},
			})
			await expect(eventBridge.invoke(message)).rejects.toMatchObject({ errorCode: 403 })
			expect(policy.canAccess).toHaveBeenCalledTimes(2)
			expect(provider.requests).toHaveLength(0)
			expect(repository.replaceRevision).not.toHaveBeenCalled()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
			await storage.close()
		}
	})

	it('does not persist an invalid embedding response', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueEmbedding({
			embeddings: [{ index: 0, vector: [0.1] }],
			usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
		})
		const repository = { replaceRevision: vi.fn(), search: vi.fn() }
		const policy = { canAccess: vi.fn().mockResolvedValue(true) }
		const eventBridge = new DefaultEventBridge()
		const storage = sqliteHarnessStorage({ file: ':memory:' })
		await eventBridge.start()
		const service = await ingestionService.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			serviceConfig: { embeddingModel: 'fake-embedding', embeddingDimensions: 2 },
			resources: {
				knowledgeCollectionPolicy: policy,
				knowledgeEmbeddingProfile: { model: 'fake-embedding', dimensions: 2 },
				knowledgeRepository: repository,
			},
			ai: {
				storage,
				model: { provider, model: 'fake-chat' },
				models: { embedding: { provider, model: 'fake-embedding' } },
			},
		})
		await service.start()
		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-alex',
						receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'runIngestKnowledge' },
						payload: {
							payload: {
								collectionId: 'customer-help',
								documentId: 'doc-1',
								revision: 1,
								title: 'Policy',
								content: 'one',
							},
							parameter: {},
						},
					}),
				),
			).rejects.toMatchObject({ errorCode: 500 })
			expect(repository.replaceRevision).not.toHaveBeenCalled()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
			await storage.close()
		}
	})

	it('retries a transient embedding failure through the model binding', async () => {
		const provider = new RetryEmbeddingProvider()
		provider.enqueueEmbedding({
			embeddings: [{ index: 0, vector: [0.1, 0.2] }],
			usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
		})
		const repository = { replaceRevision: vi.fn().mockResolvedValue(undefined), search: vi.fn() }
		const policy = { canAccess: vi.fn().mockResolvedValue(true) }
		const eventBridge = new DefaultEventBridge()
		const storage = sqliteHarnessStorage({ file: ':memory:' })
		await eventBridge.start()
		const service = await ingestionService.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			serviceConfig: { embeddingModel: 'fake-embedding', embeddingDimensions: 2 },
			resources: {
				knowledgeCollectionPolicy: policy,
				knowledgeEmbeddingProfile: { model: 'fake-embedding', dimensions: 2 },
				knowledgeRepository: repository,
			},
			ai: {
				storage,
				model: { provider: new FakeModelProvider({ strict: true }), model: 'fake-chat' },
				models: {
					embedding: {
						provider,
						model: 'fake-embedding',
						retry: {
							maxAttempts: 2,
							minDelayMs: 1,
							maxDelayMs: 2,
							maxActiveDelayMs: 20,
							maxActiveElapsedMs: 100,
							retryOn: { serverError: true },
						},
					},
				},
			},
		})
		await service.start()
		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-alex',
						receiver: { serviceName: 'Knowledge', serviceVersion: '1', serviceTarget: 'runIngestKnowledge' },
						payload: {
							payload: {
								collectionId: 'customer-help',
								documentId: 'doc-retry',
								revision: 1,
								title: 'Policy',
								content: 'one',
							},
							parameter: {},
						},
					}),
				),
			).resolves.toMatchObject({ documentId: 'doc-retry' })
			expect(provider.attempts).toBe(2)
			expect(repository.replaceRevision).toHaveBeenCalledTimes(1)
		} finally {
			await service.destroy()
			await eventBridge.destroy()
			await storage.close()
		}
	})
})
