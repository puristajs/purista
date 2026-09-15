import { HandledError, StatusCode } from '@purista/core'
import { knowledgeV1ServiceBuilder } from '../../../knowledgeV1ServiceBuilder.js'
import { queryKnowledgeRepositoryInputSchema, retrieveKnowledgeOutputSchema } from '../../../schema.js'

export const queryKnowledgeRepositoryTool = knowledgeV1ServiceBuilder
	.defineTool('queryKnowledgeRepository', {
		description: 'Query tenant-scoped knowledge vectors using a prepared embedding.',
		input: queryKnowledgeRepositoryInputSchema,
		output: retrieveKnowledgeOutputSchema,
	})
	.setHandler(async (context, input) => {
		const tenantId = context.identity.tenantId
		if (!tenantId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
		const profile = context.resources.knowledgeEmbeddingProfile
		if (input.embedding.length !== profile.dimensions || input.embedding.some((value) => !Number.isFinite(value))) {
			throw new HandledError(StatusCode.BadRequest, 'The query embedding is invalid')
		}
		return {
			matches: await context.resources.knowledgeRepository.search({
				tenantId,
				collectionId: input.collectionId,
				embeddingModel: profile.model,
				queryEmbedding: [...input.embedding],
				limit: input.limit,
				signal: context.signal,
			}),
		}
	})
