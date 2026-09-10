import { createHash } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import { ingestKnowledgeWorkflow } from '../../harness/workflow/ingestKnowledge/ingestKnowledgeWorkflow.js'
import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'
import { requireKnowledgeCollectionAccess } from '../../requireKnowledgeCollectionAccess.js'
import { ingestKnowledgeInputSchema, ingestKnowledgeOutputSchema } from '../../schema.js'

export const runIngestKnowledgeCommandBuilder = knowledgeV1ServiceBuilder
	.getCommandBuilder('runIngestKnowledge', 'Run the protected knowledge ingestion workflow')
	.addPayloadSchema(ingestKnowledgeInputSchema)
	.addOutputSchema(ingestKnowledgeOutputSchema)
	.canInvokeWorkflow('Knowledge', '1', ingestKnowledgeWorkflow.contract)
	.exposeAsHttpEndpoint('POST', 'knowledge/documents')
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
		const tenantId = context.message.tenantId
		const principalId = context.message.principalId
		if (!tenantId || !principalId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
		const sessionId = createHash('sha256')
			.update(JSON.stringify([tenantId, principalId, payload.collectionId, payload.documentId]))
			.digest('hex')
		const result = await context.workflow.Knowledge['1'][ingestKnowledgeWorkflow.contract.id].run(payload, {
			sessionId: `knowledge:${sessionId}`,
		})
		if (result.outcome.status !== 'completed') throw new Error('Knowledge ingestion did not complete')
		return result.outcome.output
	})
