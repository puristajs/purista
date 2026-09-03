import { type AgentDefinition, type BuilderState, defineHarnessModule } from '@purista/harness'
import {
	responsePlanSchema,
	riskAssessmentSchema,
	supportCaseAnalysisOutputSchema,
	supportCaseInputSchema,
} from '../../supportCaseSchemas.js'

type ParallelWorkflowState = BuilderState & {
	agents: {
		assess_support_risk: AgentDefinition<any, typeof supportCaseInputSchema, typeof riskAssessmentSchema>
		plan_support_response: AgentDefinition<any, typeof supportCaseInputSchema, typeof responsePlanSchema>
	}
}

export const analyzeSupportCaseWorkflow = defineHarnessModule<ParallelWorkflowState>()(
	'support.workflow.analyze_support_case',
	{
		version: '1.0.0',
		register(builder) {
			return builder.workflow('analyze_support_case', {
				input: supportCaseInputSchema,
				output: supportCaseAnalysisOutputSchema,
				delegation: {
					agents: ['assess_support_risk', 'plan_support_response'],
					maxChildAgentCalls: 2,
					maxParallelChildAgentCalls: 2,
				},
				handler: async (context) => {
					const results = await context.fanOut(
						['risk', 'response'] as const,
						async (focus) =>
							focus === 'risk'
								? { kind: 'risk' as const, value: await context.agents.assess_support_risk(context.input) }
								: { kind: 'response' as const, value: await context.agents.plan_support_response(context.input) },
						{ concurrency: 2 },
					)
					const risk = results.find((result) => result.kind === 'risk')
					const response = results.find((result) => result.kind === 'response')
					if (!risk || !response) throw new Error('Support analysis did not return both specialist results')
					return {
						caseId: context.input.caseId,
						risk: riskAssessmentSchema.parse(risk.value),
						response: responsePlanSchema.parse(response.value),
					}
				},
			})
		},
	},
)
