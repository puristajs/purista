import { z } from 'zod'
import { demoEmbeddingModel } from '../../KnowledgeResources.js'

export const knowledgeV1IngestKnowledgeQueuePayloadSchema = z.strictObject({
	collectionId: z.string().trim().min(1).max(64),
	documentId: z.string().trim().min(1).max(80),
	revision: z.number().int().positive(),
	title: z.string().trim().min(1).max(120),
	content: z.string().trim().min(1).max(8_000),
	embeddingModel: z.literal(demoEmbeddingModel),
})

export const knowledgeV1IngestKnowledgeQueueParameterSchema = z.object({})
