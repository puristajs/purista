import { defineAgent } from '@purista/harness'
import { riskAssessmentSchema, supportCaseInputSchema } from '../../supportCaseSchemas.js'

export const assessSupportRiskAgent = defineAgent('assessSupportRisk', {
	model: 'riskModel',
	input: supportCaseInputSchema,
	output: riskAssessmentSchema,
	instructions: [
		'Assess risk in one support message.',
		'Use only facts in the message and return short evidence statements.',
	].join(' '),
	prompt: (input) => ({
		role: 'user',
		content: `Case ${input.caseId}: ${input.message}`,
	}),
})
