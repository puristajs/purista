import { HandledError, StatusCode } from '@purista/core'
import { chunkKnowledgeText } from '../../chunkKnowledgeText.js'
import type { KnowledgeCollectionPolicy } from '../../KnowledgeCollectionPolicy.js'
import {
	demoEmbeddingDimensions,
	type KnowledgeEmbeddingProvider,
	type KnowledgeRepository,
	StaleKnowledgeRevisionError,
} from '../../KnowledgeResources.js'
import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'
import { knowledgeV1IngestKnowledgeQueuePayloadSchema } from '../../queue/ingestKnowledge/schema.js'

export class InvalidEmbeddingOutputError extends Error {
	constructor() {
		super('Embedding output does not match the requested chunks')
		this.name = 'InvalidEmbeddingOutputError'
	}
}

function validateEmbeddings(embeddings: number[][], count: number) {
	const valid = embeddings.length === count && embeddings.every(vector =>
		vector.length === demoEmbeddingDimensions && vector.every(Number.isFinite),
	)
	if (!valid) throw new InvalidEmbeddingOutputError()
	return embeddings
}

type KnowledgeWorkerResources = {
	knowledgeCollectionPolicy: KnowledgeCollectionPolicy
	knowledgeEmbeddingProvider: KnowledgeEmbeddingProvider
	knowledgeRepository: KnowledgeRepository
}

function workerResources(resources: object) {
	return resources as KnowledgeWorkerResources
}

export const ingestKnowledgeWorkerQueueWorkerBuilder = knowledgeV1ServiceBuilder
	.getQueueWorkerBuilder('ingestKnowledge', 'ingestKnowledgeWorker')
	.setMode('continuous')
	.setMaxParallelHandlers(1)
	.setBeforeGuardHooks({
		mayStillEditCollection: async function (context, message) {
			const payload = knowledgeV1IngestKnowledgeQueuePayloadSchema.parse(message.payload)
			const allowed = workerResources(context.resources).knowledgeCollectionPolicy.isAllowed({
				tenantId: message.headers['purista.tenantId'],
				principalId: message.headers['purista.principalId'],
				collectionId: payload.collectionId,
				action: 'edit',
			})
			if (!allowed) throw new HandledError(StatusCode.Forbidden, 'Collection access changed before processing')
		},
	})
	.setHandler(async function (context, message) {
		const payload = knowledgeV1IngestKnowledgeQueuePayloadSchema.parse(message.payload)
		const resources = workerResources(context.resources)
		try {
			context.signal.throwIfAborted()
			const chunks = chunkKnowledgeText(payload.content)
			const embeddings = validateEmbeddings(
				await resources.knowledgeEmbeddingProvider.embed({
					texts: chunks,
					model: payload.embeddingModel,
					signal: context.signal,
				}),
				chunks.length,
			)
			context.signal.throwIfAborted()
			await resources.knowledgeRepository.replaceRevision({
				tenantId: message.headers['purista.tenantId']!,
				collectionId: payload.collectionId,
				documentId: payload.documentId,
				revision: payload.revision,
				title: payload.title,
				embeddingModel: payload.embeddingModel,
				chunks: chunks.map((content, index) => ({
					index,
					content,
					embedding: embeddings[index]!,
				})),
			}, context.signal)
			return {
				status: 'success' as const,
				output: {
					documentId: payload.documentId,
					revision: payload.revision,
					chunkCount: chunks.length,
					embeddingModel: payload.embeddingModel,
				},
			}
		} catch (error) {
			if (context.signal.aborted) throw error
			if (error instanceof InvalidEmbeddingOutputError) {
				return { status: 'fail' as const, reason: 'invalid_embedding_output', fatal: true }
			}
			if (error instanceof StaleKnowledgeRevisionError) {
				return { status: 'fail' as const, reason: 'stale_revision', fatal: true }
			}
			return { status: 'retry' as const, reason: 'ingestion_dependency_failed', delayMs: 250 }
		}
	})
