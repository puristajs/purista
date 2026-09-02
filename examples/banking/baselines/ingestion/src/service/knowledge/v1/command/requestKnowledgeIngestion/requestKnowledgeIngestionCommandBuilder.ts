import { HandledError, StatusCode } from '@purista/core'
import {
	knowledgeV1IngestKnowledgeQueueParameterSchema,
	knowledgeV1IngestKnowledgeQueuePayloadSchema,
} from '../../queue/ingestKnowledge/schema.js'
import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'
import {
	knowledgeV1RequestKnowledgeIngestionInputParameterSchema,
	knowledgeV1RequestKnowledgeIngestionInputPayloadSchema,
	knowledgeV1RequestKnowledgeIngestionOutputPayloadSchema,
} from './schema.js'

export const requestKnowledgeIngestionCommandBuilder = knowledgeV1ServiceBuilder
	.getCommandBuilder('requestKnowledgeIngestion', 'Accept one knowledge revision for ingestion')
	.addPayloadSchema(knowledgeV1RequestKnowledgeIngestionInputPayloadSchema)
	.addParameterSchema(knowledgeV1RequestKnowledgeIngestionInputParameterSchema)
	.addOutputSchema(knowledgeV1RequestKnowledgeIngestionOutputPayloadSchema)
	.canEnqueue(
		'ingestKnowledge',
		knowledgeV1IngestKnowledgeQueuePayloadSchema,
		knowledgeV1IngestKnowledgeQueueParameterSchema,
	)
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint(
		'POST',
		'knowledge/collections/:collectionId/revisions',
		'application/json',
		'utf-8',
		'application/json',
		'utf-8',
		{ mode: 'async' },
	)
	.setBeforeGuardHooks({
		mayEditCollection: async function (context, _payload, parameter) {
			const allowed = context.resources.knowledgeCollectionPolicy.isAllowed({
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
				collectionId: parameter.collectionId,
				action: 'edit',
			})
			if (!allowed) throw new HandledError(StatusCode.Forbidden, 'Collection action is not allowed')
		},
	})
	.setCommandFunction(async function (context, payload, parameter) {
		const receipt = await context.queue.enqueue.ingestKnowledge(
			{ ...payload, collectionId: parameter.collectionId },
			{},
			{
				idempotencyKey: [
					context.message.tenantId,
					parameter.collectionId,
					payload.documentId,
					payload.revision,
				].join(':'),
				headers: {
					'purista.tenantId': context.message.tenantId ?? '',
					'purista.principalId': context.message.principalId ?? '',
				},
			},
		)
		return { ...receipt, queueName: 'ingestKnowledge' as const }
	})
