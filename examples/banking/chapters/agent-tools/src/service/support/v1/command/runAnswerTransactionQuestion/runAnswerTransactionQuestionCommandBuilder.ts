import { answerTransactionQuestionAgent } from '../../harness/agent/answerTransactionQuestion/answerTransactionQuestionAgent.js'
import { requireSupportQuestion, supportQuestionSessionId } from '../../requireSupportQuestion.js'
import { answerTransactionQuestionInputSchema, answerTransactionQuestionOutputSchema } from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const runAnswerTransactionQuestionCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('runAnswerTransactionQuestion', 'Answer a support question with authorized PURISTA tools')
	.addPayloadSchema(answerTransactionQuestionInputSchema)
	.addOutputSchema(answerTransactionQuestionOutputSchema)
	.canInvokeAgent(supportV1ServiceBuilder.harnessTarget(answerTransactionQuestionAgent.contract))
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
		const { sessionId: _sessionId, outcome } = await context.agent.Support['1'].answerTransactionQuestion.run(payload, {
			sessionId: supportQuestionSessionId(context.message, payload.questionId),
		})
		return outcome.output
	})
