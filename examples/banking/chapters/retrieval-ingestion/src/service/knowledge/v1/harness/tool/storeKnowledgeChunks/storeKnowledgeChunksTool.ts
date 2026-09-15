import { HandledError, StatusCode } from '@purista/core'
import { knowledgeV1ServiceBuilder } from '../../../knowledgeV1ServiceBuilder.js'
import { storedKnowledgeChunksInputSchema, storedKnowledgeChunksOutputSchema } from '../../../schema.js'

export const storeKnowledgeChunksTool = knowledgeV1ServiceBuilder
	.defineTool('storeKnowledgeChunks', {
		description: 'Store tenant-scoped knowledge chunks and their embeddings.',
		input: storedKnowledgeChunksInputSchema,
		output: storedKnowledgeChunksOutputSchema,
	})
	.setHandler(async (context, input) => {
		const tenantId = context.identity.tenantId
		if (!tenantId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
		const indexes = input.chunks.map((chunk) => chunk.index)
		if (indexes.some((index, position) => index !== position)) {
			throw new HandledError(StatusCode.BadRequest, 'Embedding indexes must match chunk order')
		}
		const dimension = input.chunks[0]?.embedding.length
		if (
			!dimension ||
			input.chunks.some(
				(chunk) => chunk.embedding.length !== dimension || chunk.embedding.some((value) => !Number.isFinite(value)),
			)
		) {
			throw new HandledError(StatusCode.BadRequest, 'Embedding vectors are invalid')
		}
		const repository = context.resources.knowledgeRepository
		const profile = context.resources.knowledgeEmbeddingProfile
		if (dimension !== profile.dimensions) {
			throw new HandledError(StatusCode.BadRequest, 'Embedding vectors have the wrong dimension')
		}
		await repository.replaceRevision(
			{
				tenantId,
				collectionId: input.collectionId,
				documentId: input.documentId,
				revision: input.revision,
				title: input.title,
				embeddingModel: profile.model,
				chunks: input.chunks,
			},
			context.signal,
		)
		return {
			documentId: input.documentId,
			revision: input.revision,
			chunkCount: input.chunks.length,
			embeddingModel: profile.model,
		}
	})
