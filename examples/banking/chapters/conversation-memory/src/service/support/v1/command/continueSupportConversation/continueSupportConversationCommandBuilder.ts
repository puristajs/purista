import { conversationSessionId } from '../../conversationSessionId.js'
import {
	answerSupportQuestionAgent,
	answerSupportQuestionInputSchema,
	answerSupportQuestionOutputSchema,
} from '../../harness/agent/answerSupportQuestion/answerSupportQuestionAgent.js'
import { requireSupportConversationAccess } from '../../requireSupportConversationAccess.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const continueSupportConversationCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('continueSupportConversation', 'Continue a bounded support conversation')
	.addPayloadSchema(answerSupportQuestionInputSchema)
	.addOutputSchema(answerSupportQuestionOutputSchema)
	.canInvokeAgent(supportV1ServiceBuilder.harnessTarget(answerSupportQuestionAgent.contract))
	.setBeforeGuardHooks({
		conversationAccess: async function (context, payload) {
			await requireSupportConversationAccess(
				context.resources.supportConversationPolicy,
				context.message,
				payload.conversationId,
				'continue',
			)
		},
	})
	.setCommandFunction(async function (context, payload) {
		const sessionId = conversationSessionId(context.message, payload.conversationId)
		const result = await context.agent.Support['1'][answerSupportQuestionAgent.contract.id].run(payload, { sessionId })
		return result.outcome.output
	})
