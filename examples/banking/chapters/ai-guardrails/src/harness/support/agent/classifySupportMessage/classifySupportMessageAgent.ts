import { type BuilderState, defineHarnessModule, type ModelAlias } from '@purista/harness'
import { classificationGuardrails } from './classificationGuardrails.js'
import { classifySupportMessageInputSchema, classifySupportMessageOutputSchema } from './schema.js'

type PrimaryModelState = BuilderState & { models: { primary: ModelAlias } }

export const classifySupportMessageAgent = defineHarnessModule<PrimaryModelState>()(
	'support.agent.classify-support-message',
	{
		version: '1.0.0',
		register(builder) {
			return builder.agent('classify_support_message', {
				model: 'primary',
				input: classifySupportMessageInputSchema,
				output: classifySupportMessageOutputSchema,
				updates: 'object-snapshot',
				instructions: 'Classify the support message and give one concise reason grounded in its text.',
				guardrails: classificationGuardrails,
			})
		},
	},
)
