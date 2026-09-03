import type { z } from 'zod'

import type {
	knowledgeV1RequestKnowledgeIngestionInputParameterSchema,
	knowledgeV1RequestKnowledgeIngestionInputPayloadSchema,
	knowledgeV1RequestKnowledgeIngestionOutputPayloadSchema,
}
from './schema.js'

export type KnowledgeV1RequestKnowledgeIngestionInputParameter = z.input<typeof knowledgeV1RequestKnowledgeIngestionInputParameterSchema>

export type KnowledgeV1RequestKnowledgeIngestionInputPayload = z.input<typeof knowledgeV1RequestKnowledgeIngestionInputPayloadSchema>

export type KnowledgeV1RequestKnowledgeIngestionOutputPayload = z.output<typeof knowledgeV1RequestKnowledgeIngestionOutputPayloadSchema>
