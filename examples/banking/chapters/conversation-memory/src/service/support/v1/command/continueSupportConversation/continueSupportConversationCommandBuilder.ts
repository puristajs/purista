import {
	answerSupportQuestionInputSchema,
	answerSupportQuestionOutputSchema,
} from '../../../../../harness/support/agent/answerSupportQuestion/answerSupportQuestionAgent.js'
import { conversationSessionId } from '../../conversationSessionId.js'
import { supportHarness } from '../../harness/supportHarnessMount.js'
import { requireSupportConversationAccess } from '../../requireSupportConversationAccess.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const continueSupportConversationCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('continueSupportConversation', 'Continue a bounded support conversation')
	.addPayloadSchema(answerSupportQuestionInputSchema)
	.addOutputSchema(answerSupportQuestionOutputSchema)
	.canInvokeAgent('Support', '1', 'answer_support_question', supportHarness.contracts.agents.answer_support_question)
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
		const outcome = await context.agent.Support['1'].answer_support_question.run(payload, { sessionId })
		if (outcome.status !== 'completed') throw new Error('The support answer was interrupted unexpectedly.')
		return outcome.output
	})
