import { defineAgent } from '@purista/harness'
import { classificationGuardrails } from './classificationGuardrails.js'
import { classifySupportMessageInputSchema, classifySupportMessageOutputSchema } from './schema.js'

export const classifySupportMessageAgent = defineAgent('classifySupportMessage', {
	model: 'classification',
	input: classifySupportMessageInputSchema,
	output: classifySupportMessageOutputSchema,
	instructions: 'Classify the support message and give one concise reason grounded in its text.',
	prompt: (input) => ({ role: 'user', content: `Message ${input.messageId}: ${input.text}` }),
	guardrails: classificationGuardrails,
})
