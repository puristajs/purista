import { createQueueWorkerContextMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { localKnowledgeCollectionPolicy } from '../../KnowledgeCollectionPolicy.js'
import {
	demoEmbeddingModel,
	type KnowledgeEmbeddingProvider,
	type KnowledgeRepository,
} from '../../KnowledgeResources.js'
import { ingestKnowledgeWorkerQueueWorkerBuilder } from './ingestKnowledgeWorkerQueueWorkerBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

const payload = {
	collectionId: 'policy-help',
	documentId: 'card-help',
	revision: 1,
	title: 'Card help',
	content: 'Lock a lost card in the app. Contact support for a replacement.',
	embeddingModel: demoEmbeddingModel,
}
const message = {
	id: 'job-1',
	queueName: 'ingestKnowledge',
	payload,
	parameter: {},
	headers: {
		'purista.tenantId': 'tenant-example',
		'purista.principalId': 'principal-alex',
	},
	createdAt: Date.now(),
	attempt: 1,
	maxAttempts: 3,
	leaseExpiresAt: Date.now() + 60_000,
	leaseTtlMs: 60_000,
}

function repository(): KnowledgeRepository & { replaceRevision: ReturnType<typeof vi.fn> } {
	return {
		replaceRevision: vi.fn().mockResolvedValue(undefined),
		withdrawRevision: vi.fn(),
		search: vi.fn(),
	}
}

function resources(provider: KnowledgeEmbeddingProvider, knowledgeRepository = repository()) {
	return {
		knowledgeCollectionPolicy: localKnowledgeCollectionPolicy,
		knowledgeEmbeddingProvider: provider,
		knowledgeRepository,
	}
}

describe('ingestKnowledge worker', () => {
	test('returns success and stores validated chunks', async () => {
		const knowledgeRepository = repository()
		const mocked = createQueueWorkerContextMock(ingestKnowledgeWorkerQueueWorkerBuilder, {
			queueName: 'ingestKnowledge',
			payload,
			resources: resources({
				embed: vi.fn().mockResolvedValue([[1, 0, 0, 0]]),
			}, knowledgeRepository),
			message,
			sandbox,
		})
		const definition = await ingestKnowledgeWorkerQueueWorkerBuilder.getDefinition()
		await expect(definition.handler(mocked.context as never, mocked.message as never)).resolves.toEqual({
			status: 'success',
			output: {
				documentId: 'card-help',
				revision: 1,
				chunkCount: 1,
				embeddingModel: demoEmbeddingModel,
			},
		})
		expect(knowledgeRepository.replaceRevision).toHaveBeenCalledWith(
			expect.objectContaining({
				tenantId: 'tenant-example',
				documentId: 'card-help',
				chunks: [expect.objectContaining({ embedding: [1, 0, 0, 0] })],
			}),
			expect.any(AbortSignal),
		)
	})

	test('marks malformed vectors as a fatal result without storing', async () => {
		const knowledgeRepository = repository()
		const mocked = createQueueWorkerContextMock(ingestKnowledgeWorkerQueueWorkerBuilder, {
			queueName: 'ingestKnowledge',
			payload,
			resources: resources({ embed: vi.fn().mockResolvedValue([[1, 0]]) }, knowledgeRepository),
			message,
			sandbox,
		})
		const definition = await ingestKnowledgeWorkerQueueWorkerBuilder.getDefinition()
		await expect(definition.handler(mocked.context as never, mocked.message as never)).resolves.toEqual({
			status: 'fail',
			reason: 'invalid_embedding_output',
			fatal: true,
		})
		expect(knowledgeRepository.replaceRevision).not.toHaveBeenCalled()
	})

	test('requests retry after a provider failure', async () => {
		const knowledgeRepository = repository()
		const mocked = createQueueWorkerContextMock(ingestKnowledgeWorkerQueueWorkerBuilder, {
			queueName: 'ingestKnowledge',
			payload,
			resources: resources({ embed: vi.fn().mockRejectedValue(new Error('provider unavailable')) }, knowledgeRepository),
			message,
			sandbox,
		})
		const definition = await ingestKnowledgeWorkerQueueWorkerBuilder.getDefinition()
		await expect(definition.handler(mocked.context as never, mocked.message as never)).resolves.toEqual({
			status: 'retry',
			reason: 'ingestion_dependency_failed',
			delayMs: 250,
		})
		expect(knowledgeRepository.replaceRevision).not.toHaveBeenCalled()
	})

	test('stops before dependencies when cancellation is already requested', async () => {
		const embed = vi.fn()
		const knowledgeRepository = repository()
		const mocked = createQueueWorkerContextMock(ingestKnowledgeWorkerQueueWorkerBuilder, {
			queueName: 'ingestKnowledge',
			payload,
			resources: resources({ embed }, knowledgeRepository),
			message,
			sandbox,
		})
		mocked.context.signal = AbortSignal.abort(new Error('worker stopping'))
		const definition = await ingestKnowledgeWorkerQueueWorkerBuilder.getDefinition()
		await expect(definition.handler(mocked.context as never, mocked.message as never))
			.rejects.toThrow('worker stopping')
		expect(embed).not.toHaveBeenCalled()
		expect(knowledgeRepository.replaceRevision).not.toHaveBeenCalled()
	})
})
