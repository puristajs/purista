import { defineAgent } from '@purista/harness'
import { resolutionPlanInputSchema, resolutionPlanSchema } from '../../supportResolutionSchemas.js'

export const planSupportResolutionAgent = defineAgent('planSupportResolution', {
	model: 'resolutionModel',
	input: resolutionPlanInputSchema,
	output: resolutionPlanSchema,
	instructions: 'Create a concise next-step plan grounded in the message, validated classification, and handling lane.',
	prompt: (input) => ({
		role: 'user',
		content: `Case ${input.caseId}: ${input.message}\nClassification: ${input.classification.category}, ${input.classification.urgency}\nHandling lane: ${input.handlingLane}`,
	}),
})
