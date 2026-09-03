import { type AgentDefinition, type BuilderState, defineHarnessModule, isHarnessError } from '@purista/harness'
import {
	type resolutionPlanInputSchema,
	resolutionPlanSchema,
	supportClassificationSchema,
	supportResolutionInputSchema,
	supportResolutionOutputSchema,
} from '../../supportResolutionSchemas.js'

type ResolutionWorkflowState = BuilderState & {
	agents: {
		classify_support_case: AgentDefinition<any, typeof supportResolutionInputSchema, typeof supportClassificationSchema>
		plan_support_resolution: AgentDefinition<any, typeof resolutionPlanInputSchema, typeof resolutionPlanSchema>
	}
}

export const resolveSupportCaseWorkflow = defineHarnessModule<ResolutionWorkflowState>()(
	'support.workflow.resolve_support_case',
	{
		version: '1.0.0',
		register(builder) {
			return builder.workflow('resolve_support_case', {
				input: supportResolutionInputSchema,
				output: supportResolutionOutputSchema,
				delegation: {
					agents: ['classify_support_case', 'plan_support_resolution'],
					maxChildAgentCalls: 3,
					maxParallelChildAgentCalls: 1,
				},
				handler: async (context) => {
					const classification = supportClassificationSchema.parse(
						await context.step('classify-case-v1', () => context.agents.classify_support_case(context.input)),
					)
					const plan = resolutionPlanSchema.parse(
						await context.step(
							'plan-resolution-v1',
							() => context.agents.plan_support_resolution({ ...context.input, classification }),
							{
								retry: {
									maxAttempts: 2,
									minDelayMs: 100,
									maxDelayMs: 1_000,
									backoff: 'exponential',
									shouldRetry: (error) => isHarnessError(error) && error.retriable,
								},
							},
						),
					)
					return { caseId: context.input.caseId, classification, plan }
				},
			})
		},
	},
)
