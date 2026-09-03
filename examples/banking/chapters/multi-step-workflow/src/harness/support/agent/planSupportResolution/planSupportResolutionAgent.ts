import { type BuilderState, defineHarnessModule, type ModelAlias } from '@purista/harness'
import { resolutionPlanInputSchema, resolutionPlanSchema } from '../../supportResolutionSchemas.js'

type ResolutionModelState = BuilderState & { models: { resolution_model: ModelAlias } }

export const planSupportResolutionAgent = defineHarnessModule<ResolutionModelState>()(
	'support.agent.plan_support_resolution',
	{
		version: '1.0.0',
		register(builder) {
			return builder.agent('plan_support_resolution', {
				model: 'resolution_model',
				input: resolutionPlanInputSchema,
				output: resolutionPlanSchema,
				instructions: 'Create a concise next-step plan grounded in the message and validated classification.',
			})
		},
	},
)
