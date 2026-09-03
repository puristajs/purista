import {
	answerProcedureQuestionInputSchema,
	answerProcedureQuestionOutputSchema,
} from '../../../../../harness/support/agent/answerProcedureQuestion/answerProcedureQuestionAgent.js'
import { supportHarness } from '../../harness/supportHarnessMount.js'
import { requireSupportProcedureAccess, supportProcedureSessionId } from '../../requireSupportProcedureAccess.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const answerProcedureQuestionCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('answerProcedureQuestion', 'Answer a support procedure question with a reviewed Skill')
	.addPayloadSchema(answerProcedureQuestionInputSchema)
	.addOutputSchema(answerProcedureQuestionOutputSchema)
	.canInvokeAgent(
		'Support',
		'1',
		'answer_procedure_question',
		supportHarness.contracts.agents.answer_procedure_question,
	)
	.setBeforeGuardHooks({
		procedureAccess: async function (context, payload) {
			await requireSupportProcedureAccess(
				context.resources.supportProcedurePolicy,
				{ tenantId: context.message.tenantId, principalId: context.message.principalId },
				payload.caseId,
			)
		},
	})
	.setCommandFunction(async function (context, payload) {
		const outcome = await context.agent.Support['1'].answer_procedure_question.run(payload, {
			sessionId: supportProcedureSessionId(context.message, payload.caseId),
		})
		if (outcome.status !== 'completed') throw new Error('The procedure answer was interrupted unexpectedly.')
		return outcome.output
	})
