import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'
import { requireKnowledgeCollectionAccess } from '../../requireKnowledgeCollectionAccess.js'
import { searchKnowledgeInputSchema, searchKnowledgeOutputSchema } from '../../schema.js'

export const searchKnowledgeCommandBuilder = knowledgeV1ServiceBuilder
	.getCommandBuilder('searchKnowledge', 'Search authorized knowledge chunks for a grounded answer')
	.addPayloadSchema(searchKnowledgeInputSchema)
	.addOutputSchema(searchKnowledgeOutputSchema)
	.setBeforeGuardHooks({
		collectionAccess: async function (context, payload) {
			await requireKnowledgeCollectionAccess(context.resources.knowledgeCollectionPolicy, {
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
				collectionId: payload.collectionId,
			})
		},
	})
	.setCommandFunction(async function (context, payload) {
		const queryEmbedding = await context.resources.knowledgeEmbeddingProvider.embedQuery({
			text: payload.query,
		})
		const matches = await context.resources.knowledgeRepository.search({
			tenantId: context.message.tenantId ?? '',
			collectionId: payload.collectionId,
			embeddingModel: context.resources.knowledgeEmbeddingProvider.model,
			queryEmbedding,
			limit: payload.limit,
		})
		return { matches }
	})
