import { type BuilderState, defineHarnessModule, type ModelAlias } from '@purista/harness'
import { z } from 'zod'

export const classifySupportMessageInputSchema = z.strictObject({
	messageId: z.string().trim().min(1).max(80),
	text: z.string().trim().min(1).max(2_000),
})

export const classifySupportMessageOutputSchema = z.strictObject({
	category: z.enum(['account_access', 'card', 'transfer', 'other']),
	urgency: z.enum(['normal', 'urgent']),
	reason: z.string().trim().min(1).max(240),
})

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
				instructions: [
					'Classify one Example Bank support message.',
					'Use urgent only when the text describes an immediate deadline, active loss, or blocked essential access.',
					'Give one short reason grounded only in the supplied text.',
				].join(' '),
			})
		},
	},
)
