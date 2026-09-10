import { defineWorkflow } from '@purista/harness'
import { chunkKnowledgeText } from '../../../chunkKnowledgeText.js'
import { ingestKnowledgeInputSchema, ingestKnowledgeOutputSchema } from '../../../schema.js'
import { storeKnowledgeChunksTool } from '../../tool/storeKnowledgeChunks/storeKnowledgeChunksTool.js'

export const ingestKnowledgeWorkflow = defineWorkflow('ingestKnowledge', {
	input: ingestKnowledgeInputSchema,
	output: ingestKnowledgeOutputSchema,
	models: {
		embedding: { capabilities: ['embeddings'] },
	},
	tools: [storeKnowledgeChunksTool],
	handler: async (context) => {
		const chunks = chunkKnowledgeText(context.input.content)
		const response = await context.models.embedding.embed({ input: chunks }, { callId: 'embed-knowledge-chunks' })
		const embeddings = [...response.embeddings].sort((left, right) => left.index - right.index)
		if (
			embeddings.length !== chunks.length ||
			embeddings.some(
				(embedding, index) =>
					embedding.index !== index ||
					embedding.vector.length === 0 ||
					embedding.vector.some((value) => !Number.isFinite(value)),
			)
		) {
			throw new Error('The embedding model returned invalid document vectors')
		}
		return context.tools.storeKnowledgeChunks.run(
			{
				collectionId: context.input.collectionId,
				documentId: context.input.documentId,
				revision: context.input.revision,
				title: context.input.title,
				chunks: chunks.map((content, index) => ({ content, index, embedding: [...(embeddings[index]?.vector ?? [])] })),
			},
			{ callId: 'store-knowledge-chunks' },
		)
	},
})
