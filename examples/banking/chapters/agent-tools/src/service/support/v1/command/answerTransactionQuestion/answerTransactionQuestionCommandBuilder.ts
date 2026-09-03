import {
	answerTransactionQuestionInputSchema,
	answerTransactionQuestionOutputSchema,
} from '../../../../../harness/support/agent/answerTransactionQuestion/answerTransactionQuestionAgent.js'
import { supportHarness } from '../../harness/supportHarnessMount.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const answerTransactionQuestionCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('answerTransactionQuestion', 'Answer a support question with authorized PURISTA tools')
	.addPayloadSchema(answerTransactionQuestionInputSchema)
	.addOutputSchema(answerTransactionQuestionOutputSchema)
	.canInvokeAgent(
		'Support',
		'1',
		'answer_transaction_question',
		supportHarness.contracts.agents.answer_transaction_question,
	)
	.setCommandFunction(async function (context, payload) {
		const outcome = await context.agent.Support['1'].answer_transaction_question.run(payload, {
			sessionId: `support-question:${payload.questionId}`,
		})
		if (outcome.status !== 'completed') throw new Error('The support answer was interrupted unexpectedly.')
		return outcome.output
	})
