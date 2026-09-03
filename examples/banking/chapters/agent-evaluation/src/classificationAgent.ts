import { defineHarness } from '@purista/harness'
import { z } from 'zod'

export const classificationInputSchema = z.strictObject({
	messageId: z.string().trim().min(1).max(80),
	text: z.string().trim().min(1).max(2_000),
})

export const classificationOutputSchema = z.strictObject({
	category: z.enum(['account_access', 'card', 'transfer', 'other']),
	urgency: z.enum(['normal', 'urgent']),
	reason: z.string().trim().min(1).max(240),
})

export const classificationHarness = defineHarness({ name: 'classification-evaluation' })
	.requireModel('primary', { capabilities: ['object'] })
	.agent('classify_support_message', {
		model: 'primary',
		input: classificationInputSchema,
		output: classificationOutputSchema,
		instructions: [
			'Classify one Example Bank support message.',
			'Use urgent only for an immediate deadline, active loss, or blocked essential access.',
			'Give one short reason grounded only in the supplied message.',
		].join(' '),
	})
	.define()

export type ClassificationInput = z.output<typeof classificationInputSchema>
export type ClassificationOutput = z.output<typeof classificationOutputSchema>
