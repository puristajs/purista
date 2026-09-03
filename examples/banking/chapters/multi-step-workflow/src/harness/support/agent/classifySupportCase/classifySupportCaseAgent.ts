import { type BuilderState, defineHarnessModule, type ModelAlias } from '@purista/harness'
import { supportClassificationSchema, supportResolutionInputSchema } from '../../supportResolutionSchemas.js'

type ClassificationModelState = BuilderState & { models: { classification_model: ModelAlias } }

export const classifySupportCaseAgent = defineHarnessModule<ClassificationModelState>()(
	'support.agent.classify_support_case',
	{
		version: '1.0.0',
		register(builder) {
			return builder.agent('classify_support_case', {
				model: 'classification_model',
				input: supportResolutionInputSchema,
				output: supportClassificationSchema,
				instructions: 'Classify one Example Bank support case using only the supplied message.',
			})
		},
	},
)
