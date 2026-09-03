import { chunkKnowledgeText } from '../../chunkKnowledgeText.js'
import { knowledgeHarness } from '../../harness/knowledgeHarnessMount.js'
import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'
import { requireKnowledgeCollectionAccess } from '../../requireKnowledgeCollectionAccess.js'
import { ingestKnowledgeInputSchema, ingestKnowledgeOutputSchema } from '../../schema.js'

export const ingestKnowledgeCommandBuilder = knowledgeV1ServiceBuilder
	.getCommandBuilder('ingestKnowledge', 'Chunk, embed, and store one reviewed knowledge revision')
	.addPayloadSchema(ingestKnowledgeInputSchema)
	.addOutputSchema(ingestKnowledgeOutputSchema)
	.canUseHarnessModel(knowledgeHarness, 'embedding')
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('POST', 'knowledge/documents')
	.setOpenApiSummary('Ingest a reviewed knowledge document')
	.addOpenApiTags('knowledge', 'ai')
	.setBeforeGuardHooks({
		collectionAccess: async function (context, payload) {
			await requireKnowledgeCollectionAccess(context.resources.knowledgeCollectionPolicy, {
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
				collectionId: payload.collectionId,
				action: 'edit',
			})
		},
	})
	.setCommandFunction(async function (context, payload) {
		const signal = new AbortController().signal
		const chunks = chunkKnowledgeText(payload.content)
		const response = await context.model.embedding.embed(
			{ input: chunks, dimensions: this.config.embeddingDimensions },
			signal,
		)
		const embeddings = [...response.embeddings].sort((left, right) => left.index - right.index)
		if (
			embeddings.length !== chunks.length ||
			embeddings.some(
				(embedding, index) =>
					embedding.index !== index ||
					embedding.vector.length !== this.config.embeddingDimensions ||
					embedding.vector.some((value) => !Number.isFinite(value)),
			)
		) {
			throw new Error('The embedding model returned invalid document vectors')
		}

		await context.resources.knowledgeRepository.replaceRevision(
			{
				tenantId: context.message.tenantId ?? '',
				collectionId: payload.collectionId,
				documentId: payload.documentId,
				revision: payload.revision,
				title: payload.title,
				embeddingModel: this.config.embeddingModel,
				chunks: chunks.map((content, index) => {
					const embedding = embeddings[index]
					if (!embedding) throw new Error('The embedding model omitted a document vector')
					return { index, content, embedding: [...embedding.vector] }
				}),
			},
			signal,
		)

		return {
			documentId: payload.documentId,
			revision: payload.revision,
			chunkCount: chunks.length,
			embeddingModel: this.config.embeddingModel,
		}
	})
