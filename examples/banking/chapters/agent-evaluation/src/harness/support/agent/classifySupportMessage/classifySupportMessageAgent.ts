import { type BuilderState, defineHarnessModule, type ModelAlias } from '@purista/harness'
import { classificationInputSchema, classificationOutputSchema } from '../../supportClassificationSchemas.js'

type PrimaryModelState = BuilderState & { models: { primary: ModelAlias } }

export const classifySupportMessageAgent = defineHarnessModule<PrimaryModelState>()(
	'support.agent.classify_support_message',
	{
		version: '1.0.0',
		register(builder) {
			return builder.agent('classify_support_message', {
				model: 'primary',
				input: classificationInputSchema,
				output: classificationOutputSchema,
				instructions: [
					'Classify one Example Bank support message.',
					'Use urgent only for an immediate deadline, active loss, or blocked essential access.',
					'Give one short reason grounded only in the supplied message.',
				].join(' '),
			})
		},
	},
)
