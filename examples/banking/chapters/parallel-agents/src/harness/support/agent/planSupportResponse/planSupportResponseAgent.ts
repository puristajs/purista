import { type BuilderState, defineHarnessModule, type ModelAlias } from '@purista/harness'
import { responsePlanSchema, supportCaseInputSchema } from '../../supportCaseSchemas.js'

type ResponseModelState = BuilderState & { models: { response_model: ModelAlias } }

export const planSupportResponseAgent = defineHarnessModule<ResponseModelState>()(
	'support.agent.plan_support_response',
	{
		version: '1.0.0',
		register(builder) {
			return builder.agent('plan_support_response', {
				model: 'response_model',
				input: supportCaseInputSchema,
				output: responsePlanSchema,
				instructions: [
					'Plan a concise Example Bank support response.',
					'Do not claim an action happened. Select the next action that a service should perform.',
				].join(' '),
			})
		},
	},
)
