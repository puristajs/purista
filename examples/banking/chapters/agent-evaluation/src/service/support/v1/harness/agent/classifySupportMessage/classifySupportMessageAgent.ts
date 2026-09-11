import { defineAgent } from '@purista/harness'
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

export type ClassificationInput = z.output<typeof classifySupportMessageInputSchema>
export type ClassificationOutput = z.output<typeof classifySupportMessageOutputSchema>

/** The portable definition exercised by the offline evaluation and mounted Support service. */
export const classifySupportMessageAgent = defineAgent('classifySupportMessage', {
	model: 'classification',
	input: classifySupportMessageInputSchema,
	output: classifySupportMessageOutputSchema,
	instructions: [
		'Classify one Example Bank support message.',
		'Use urgent only for an immediate deadline, active loss, or blocked essential access.',
		'Give one short reason grounded only in the supplied message.',
	].join(' '),
	prompt: (input) => ({ role: 'user', content: `Message ${input.messageId}: ${input.text}` }),
})
