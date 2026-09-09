import { answerProcedureQuestionAgent } from '../../harness/agent/answerProcedureQuestion/answerProcedureQuestionAgent.js'
import { requireSupportProcedureAccess, supportProcedureSessionId } from '../../requireSupportProcedureAccess.js'
import { answerProcedureQuestionInputSchema, answerProcedureQuestionOutputSchema } from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const runAnswerProcedureQuestionCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('runAnswerProcedureQuestion', 'Answer a support procedure question using reviewed guidance')
	.addPayloadSchema(answerProcedureQuestionInputSchema)
	.addOutputSchema(answerProcedureQuestionOutputSchema)
	.canInvokeAgent('Support', '1', answerProcedureQuestionAgent.contract)
	.setBeforeGuardHooks({
		procedureAccess: async function (context, payload) {
			await requireSupportProcedureAccess(context.resources.supportProcedurePolicy, context.message, payload.caseId)
		},
	})
	.setCommandFunction(async function (context, payload) {
		const { sessionId: _sessionId, outcome } = await context.agent.Support['1'].answerProcedureQuestion.run(payload, {
			sessionId: supportProcedureSessionId(context.message, payload.caseId),
		})
		if (outcome.status !== 'completed') throw new Error('The procedure answer was interrupted unexpectedly.')
		return outcome.output
	})
