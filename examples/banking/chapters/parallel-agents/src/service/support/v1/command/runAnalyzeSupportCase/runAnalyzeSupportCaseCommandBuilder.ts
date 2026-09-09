import { supportCaseAnalysisOutputSchema, supportCaseInputSchema } from '../../harness/supportCaseSchemas.js'
import { analyzeSupportCaseWorkflow } from '../../harness/workflow/analyzeSupportCase/analyzeSupportCaseWorkflow.js'
import { requireSupportCaseAnalysis, supportCaseSessionId } from '../../requireSupportCaseAnalysis.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const runAnalyzeSupportCaseCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('runAnalyzeSupportCase', 'Run bounded specialist analysis for one support case')
	.addPayloadSchema(supportCaseInputSchema)
	.addOutputSchema(supportCaseAnalysisOutputSchema)
	.canInvokeWorkflow('Support', '1', analyzeSupportCaseWorkflow.contract)
	.setBeforeGuardHooks({
		caseAccess: async function (context, payload) {
			await requireSupportCaseAnalysis(context.resources.supportCasePolicy, {
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
				caseId: payload.caseId,
			})
		},
	})
	.setCommandFunction(async function (context, payload) {
		const result = await context.workflow.Support['1'][analyzeSupportCaseWorkflow.contract.id].run(payload, {
			sessionId: supportCaseSessionId(context.message, payload.caseId),
		})
		if (result.outcome.status !== 'completed') throw new Error('Support case analysis did not complete.')
		return result.outcome.output
	})
