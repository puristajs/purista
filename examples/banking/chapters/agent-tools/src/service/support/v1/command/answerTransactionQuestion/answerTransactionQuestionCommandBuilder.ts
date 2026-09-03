import {
	answerTransactionQuestionInputSchema,
	answerTransactionQuestionOutputSchema,
} from '../../../../../harness/support/agent/answerTransactionQuestion/answerTransactionQuestionAgent.js'
import { supportHarness } from '../../harness/supportHarnessMount.js'
import { requireSupportQuestion, supportQuestionSessionId } from '../../requireSupportQuestion.js'
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
	.setBeforeGuardHooks({
		questionAccess: async function (context, payload) {
			await requireSupportQuestion(context.resources.supportQuestionPolicy, {
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
				accountId: payload.accountId,
				transactionId: payload.transactionId,
			})
		},
	})
	.setCommandFunction(async function (context, payload) {
		const outcome = await context.agent.Support['1'].answer_transaction_question.run(payload, {
			sessionId: supportQuestionSessionId(context.message, payload.questionId),
		})
		if (outcome.status !== 'completed') throw new Error('The support answer was interrupted unexpectedly.')
		return outcome.output
	})
