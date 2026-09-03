import { knowledgeHarness } from '../../harness/knowledgeHarnessMount.js'
import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'
import { requireKnowledgeCollectionAccess } from '../../requireKnowledgeCollectionAccess.js'
import { searchKnowledgeInputSchema, searchKnowledgeOutputSchema } from '../../schema.js'

export const searchKnowledgeCommandBuilder = knowledgeV1ServiceBuilder
	.getCommandBuilder('searchKnowledge', 'Search authorized knowledge chunks for a grounded answer')
	.addPayloadSchema(searchKnowledgeInputSchema)
	.addOutputSchema(searchKnowledgeOutputSchema)
	.canUseHarnessModel(knowledgeHarness, 'embedding')
	.setBeforeGuardHooks({
		collectionAccess: async function (context, payload) {
			await requireKnowledgeCollectionAccess(context.resources.knowledgeCollectionPolicy, {
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
				collectionId: payload.collectionId,
				action: 'search',
			})
		},
	})
	.setCommandFunction(async function (context, payload) {
		const signal = new AbortController().signal
		const response = await context.model.embedding.embed(
			{ input: payload.query, dimensions: this.config.embeddingDimensions },
			signal,
		)
		const queryEmbedding = response.embeddings[0]?.vector
		if (!queryEmbedding) throw new Error('The embedding model returned no query vector')
		const matches = await context.resources.knowledgeRepository.search({
			tenantId: context.message.tenantId ?? '',
			collectionId: payload.collectionId,
			embeddingModel: this.config.embeddingModel,
			queryEmbedding: [...queryEmbedding],
			limit: payload.limit,
			signal,
		})
		return { matches }
	})
