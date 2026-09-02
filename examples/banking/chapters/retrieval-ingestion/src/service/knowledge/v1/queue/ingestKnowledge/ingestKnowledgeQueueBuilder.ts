import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'
import {
	knowledgeV1IngestKnowledgeQueueParameterSchema,
	knowledgeV1IngestKnowledgeQueuePayloadSchema,
} from './schema.js'

export const ingestKnowledgeQueueBuilder = knowledgeV1ServiceBuilder
	.getQueueBuilder('ingestKnowledge', 'Ingest one knowledge revision')
	.addPayloadSchema(knowledgeV1IngestKnowledgeQueuePayloadSchema)
	.addParameterSchema(knowledgeV1IngestKnowledgeQueueParameterSchema)
	.setLifecycleConfig({ maxAttempts: 3 })
	.setResultPolicy({ mode: 'state', delivery: 'required', ttlMs: 15 * 60 * 1000 })
