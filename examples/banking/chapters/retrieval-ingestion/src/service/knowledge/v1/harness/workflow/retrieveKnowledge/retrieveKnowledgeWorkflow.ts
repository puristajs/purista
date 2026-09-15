import { defineWorkflow } from '@purista/harness'
import { retrieveKnowledgeInputSchema, retrieveKnowledgeOutputSchema } from '../../../schema.js'
import { queryKnowledgeRepositoryTool } from '../../tool/queryKnowledgeRepository/queryKnowledgeRepositoryTool.js'

export const retrieveKnowledgeWorkflow = defineWorkflow('retrieveKnowledge', {
	input: retrieveKnowledgeInputSchema,
	output: retrieveKnowledgeOutputSchema,
	models: { embedding: { capabilities: ['embeddings'] } },
	tools: [queryKnowledgeRepositoryTool],
	handler: async (context) => {
		const embedding = (
			await context.models.embedding.embed({ input: context.input.query }, { callId: 'embed-knowledge-query' })
		).embeddings[0]?.vector
		if (!embedding || embedding.some((value) => !Number.isFinite(value)))
			throw new Error('The embedding model returned no query vector')
		return context.tools.queryKnowledgeRepository.run(
			{
				collectionId: context.input.collectionId,
				query: context.input.query,
				limit: context.input.limit,
				embedding: [...embedding],
			},
			{ callId: 'query-knowledge-repository' },
		)
	},
})
