import {
	supportCaseAnalysisOutputSchema,
	supportCaseInputSchema,
} from '../../../../../harness/support/supportCaseAnalysisHarness.js'
import { supportCaseAnalysisHarness } from '../../harness/supportHarnessMount.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const analyzeSupportCaseCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('analyzeSupportCase', 'Run bounded specialist analysis for one support case')
	.addPayloadSchema(supportCaseInputSchema)
	.addOutputSchema(supportCaseAnalysisOutputSchema)
	.canInvokeWorkflow(
		'Support',
		'1',
		'analyze_support_case',
		supportCaseAnalysisHarness.contracts.workflows.analyze_support_case,
	)
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('POST', 'support/case-analysis')
	.setCommandFunction(async function (context, payload) {
		const outcome = await context.workflow.Support['1'].analyze_support_case.run(payload, {
			sessionId: `support-case:${payload.caseId}`,
		})
		if (outcome.status !== 'completed') throw new Error('Support case analysis did not complete')
		return outcome.output
	})
