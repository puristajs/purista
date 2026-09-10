import { createHash } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import { retrieveKnowledgeWorkflow } from '../../harness/workflow/retrieveKnowledge/retrieveKnowledgeWorkflow.js'
import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'
import { requireKnowledgeCollectionAccess } from '../../requireKnowledgeCollectionAccess.js'
import { searchKnowledgeInputSchema, searchKnowledgeOutputSchema } from '../../schema.js'

export const searchKnowledgeCommandBuilder = knowledgeV1ServiceBuilder
	.getCommandBuilder('searchKnowledge', 'Search authorized knowledge chunks for a grounded answer')
	.addPayloadSchema(searchKnowledgeInputSchema)
	.addOutputSchema(searchKnowledgeOutputSchema)
	.canInvokeWorkflow('Knowledge', '1', retrieveKnowledgeWorkflow.contract)
	.setBeforeGuardHooks({
		collectionAccess: async function (context, payload) {
			await requireKnowledgeCollectionAccess(context.resources.knowledgeCollectionPolicy, {
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
				collectionId: payload.collectionId,
				action: 'search',
			})
		},
	})
	.setCommandFunction(async function (context, payload) {
		const tenantId = context.message.tenantId
		const principalId = context.message.principalId
		if (!tenantId || !principalId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
		const sessionId = createHash('sha256')
			.update(JSON.stringify([tenantId, principalId, payload.collectionId, payload.query]))
			.digest('hex')
		const result = await context.workflow.Knowledge['1'][retrieveKnowledgeWorkflow.contract.id].run(payload, {
			sessionId,
		})
		if (result.outcome.status !== 'completed') throw new Error('Knowledge retrieval did not complete')
		return result.outcome.output
	})
