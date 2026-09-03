import {
	answerProcedureQuestionInputSchema,
	answerProcedureQuestionOutputSchema,
} from '../../../../../harness/support/supportHarness.js'
import { supportHarness } from '../../harness/supportHarnessMount.js'
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
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('POST', 'support/procedure-question')
	.setCommandFunction(async function (context, payload) {
		const outcome = await context.agent.Support['1'].answer_procedure_question.run(payload, {
			sessionId: `support-procedure:${payload.requestId}`,
		})
		if (outcome.status !== 'completed') throw new Error('The procedure answer was interrupted unexpectedly.')
		return outcome.output
	})
