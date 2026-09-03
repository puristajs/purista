import {
	answerSupportQuestionInputSchema,
	answerSupportQuestionOutputSchema,
} from '../../../../../harness/support/answerSupportQuestionAgent.js'
import { conversationSessionId } from '../../conversationSessionId.js'
import { supportHarness } from '../../harness/supportHarnessMount.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const continueSupportConversationCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('continueSupportConversation', 'Continue a bounded support conversation')
	.addPayloadSchema(answerSupportQuestionInputSchema)
	.addOutputSchema(answerSupportQuestionOutputSchema)
	.canInvokeAgent('Support', '1', 'answer_support_question', supportHarness.contracts.agents.answer_support_question)
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('POST', 'support/conversations')
	.setCommandFunction(async function (context, payload) {
		const sessionId = conversationSessionId(context.message, payload.conversationId)
		const outcome = await context.agent.Support['1'].answer_support_question.run(payload, { sessionId })
		if (outcome.status !== 'completed') throw new Error('The support answer was interrupted unexpectedly.')
		return outcome.output
	})
