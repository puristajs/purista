import type { z } from 'zod'

import type {
	knowledgeV1IngestKnowledgeQueueParameterSchema,
	knowledgeV1IngestKnowledgeQueuePayloadSchema,
}
 from './schema.js'

export type KnowledgeV1IngestKnowledgeQueueParameter = z.input<typeof knowledgeV1IngestKnowledgeQueueParameterSchema>

export type KnowledgeV1IngestKnowledgeQueuePayload = z.input<typeof knowledgeV1IngestKnowledgeQueuePayloadSchema>
