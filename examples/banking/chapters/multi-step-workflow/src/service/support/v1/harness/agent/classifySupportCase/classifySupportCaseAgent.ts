import { defineAgent } from '@purista/harness'
import { supportClassificationSchema, supportResolutionInputSchema } from '../../supportResolutionSchemas.js'

export const classifySupportCaseAgent = defineAgent('classifySupportCase', {
	model: 'classification',
	input: supportResolutionInputSchema,
	output: supportClassificationSchema,
	instructions: 'Classify one Example Bank support case using only the supplied message.',
	prompt: (input) => ({
		role: 'user',
		content: `Case ${input.caseId}: ${input.message}`,
	}),
})
