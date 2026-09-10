import { createHash } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import { answerKnowledgeQuestionAgent } from '../../harness/agent/answerKnowledgeQuestion/answerKnowledgeQuestionAgent.js'
import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'
import { requireKnowledgeCollectionAccess } from '../../requireKnowledgeCollectionAccess.js'
import { runAnswerKnowledgeQuestionInputSchema, runAnswerKnowledgeQuestionOutputSchema } from '../../schema.js'

export const runAnswerKnowledgeQuestionCommandBuilder = knowledgeV1ServiceBuilder
	.getCommandBuilder('runAnswerKnowledgeQuestion', 'Answer a knowledge question with the protected retrieval agent')
	.addPayloadSchema(runAnswerKnowledgeQuestionInputSchema)
	.addOutputSchema(runAnswerKnowledgeQuestionOutputSchema)
	.canInvokeAgent('Knowledge', '1', answerKnowledgeQuestionAgent.contract)
	.exposeAsHttpEndpoint('POST', 'knowledge/answer')
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
			.update(JSON.stringify([tenantId, principalId, payload.conversationId]))
			.digest('hex')
		return context.agent.Knowledge['1'][answerKnowledgeQuestionAgent.contract.id].run(
			{ collectionId: payload.collectionId, question: payload.question },
			{
				sessionId: `knowledge-answer:${sessionId}`,
				...(payload.resume === undefined ? {} : { resume: payload.resume }),
			},
		)
	})
