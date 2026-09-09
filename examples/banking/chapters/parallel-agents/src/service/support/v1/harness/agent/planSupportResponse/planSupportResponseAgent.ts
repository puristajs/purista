import { defineAgent } from '@purista/harness'
import { responsePlanSchema, supportCaseInputSchema } from '../../supportCaseSchemas.js'

export const planSupportResponseAgent = defineAgent('planSupportResponse', {
	model: 'responseModel',
	input: supportCaseInputSchema,
	output: responsePlanSchema,
	instructions: [
		'Plan a short support response.',
		'Do not claim an action happened. Select the next action for a service to perform.',
	].join(' '),
	prompt: (input) => ({
		role: 'user',
		content: `Case ${input.caseId}: ${input.message}`,
	}),
})
