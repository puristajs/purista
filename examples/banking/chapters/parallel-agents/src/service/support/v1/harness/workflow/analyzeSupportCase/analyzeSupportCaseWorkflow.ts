import { defineWorkflow } from '@purista/harness'
import { assessSupportRiskAgent } from '../../agent/assessSupportRisk/assessSupportRiskAgent.js'
import { planSupportResponseAgent } from '../../agent/planSupportResponse/planSupportResponseAgent.js'
import {
	responsePlanSchema,
	riskAssessmentSchema,
	supportCaseAnalysisOutputSchema,
	supportCaseInputSchema,
} from '../../supportCaseSchemas.js'

export const analyzeSupportCaseWorkflow = defineWorkflow('analyzeSupportCase', {
	input: supportCaseInputSchema,
	output: supportCaseAnalysisOutputSchema,
	agents: [assessSupportRiskAgent, planSupportResponseAgent],
	agentCalls: { maxCalls: 2, maxParallel: 2 },
	handler: async (context) => {
		const results = await context.fanOut(
			['risk', 'response'],
			async (focus) =>
				focus === 'risk'
					? context.agents.assessSupportRisk.run(context.input, { callId: 'assess-risk' })
					: context.agents.planSupportResponse.run(context.input, { callId: 'plan-response' }),
			{ concurrency: 2 },
		)

		return {
			caseId: context.input.caseId,
			risk: riskAssessmentSchema.parse(results[0]),
			response: responsePlanSchema.parse(results[1]),
		}
	},
})
