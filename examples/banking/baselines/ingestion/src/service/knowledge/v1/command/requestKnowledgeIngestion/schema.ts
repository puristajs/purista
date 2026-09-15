import { z } from 'zod'
import { demoEmbeddingModel } from '../../KnowledgeResources.js'

export const knowledgeV1RequestKnowledgeIngestionInputParameterSchema = z.object({
	collectionId: z.string().trim().min(1).max(64),
})

export const knowledgeV1RequestKnowledgeIngestionInputPayloadSchema = z.strictObject({
	documentId: z.string().trim().min(1).max(80),
	revision: z.number().int().positive(),
	title: z.string().trim().min(1).max(120),
	content: z.string().trim().min(1).max(8_000),
	embeddingModel: z.literal(demoEmbeddingModel),
})

export const knowledgeV1RequestKnowledgeIngestionOutputPayloadSchema = z.strictObject({
	jobId: z.string().min(1),
	queueName: z.literal('ingestKnowledge'),
	scheduledAt: z.number().int().nonnegative().optional(),
})
