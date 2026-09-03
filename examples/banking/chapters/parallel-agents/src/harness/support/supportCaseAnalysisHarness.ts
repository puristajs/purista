import { defineHarness } from '@purista/harness'
import { z } from 'zod'

export const supportCaseInputSchema = z.strictObject({
	caseId: z.string().trim().min(1).max(80),
	message: z.string().trim().min(1).max(2_000),
})

export const riskAssessmentSchema = z.strictObject({
	level: z.enum(['low', 'medium', 'high']),
	evidence: z.array(z.string().trim().min(1).max(160)).max(5),
})

export const responsePlanSchema = z.strictObject({
	customerReply: z.string().trim().min(1).max(500),
	nextAction: z.enum(['reply', 'verify_identity', 'freeze_card', 'escalate']),
})

export const supportCaseAnalysisOutputSchema = z.strictObject({
	caseId: z.string(),
	risk: riskAssessmentSchema,
	response: responsePlanSchema,
})

export const supportCaseAnalysisHarness = defineHarness({ name: 'support-case-analysis' })
	.requireModel('risk_model', { capabilities: ['object'] })
	.requireModel('response_model', { capabilities: ['object'] })
	.agent('assess_support_risk', {
		model: 'risk_model',
		input: supportCaseInputSchema,
		output: riskAssessmentSchema,
		instructions: [
			'Assess security and financial risk in one Example Bank support message.',
			'Use only facts present in the message and list short evidence statements.',
		].join(' '),
	})
	.agent('plan_support_response', {
		model: 'response_model',
		input: supportCaseInputSchema,
		output: responsePlanSchema,
		instructions: [
			'Plan a concise Example Bank support response.',
			'Do not claim an action happened. Select the next action that a service should perform.',
		].join(' '),
	})
	.workflow('analyze_support_case', {
		input: supportCaseInputSchema,
		output: supportCaseAnalysisOutputSchema,
		delegation: {
			agents: ['assess_support_risk', 'plan_support_response'],
			maxChildAgentCalls: 2,
			maxParallelChildAgentCalls: 2,
		},
		handler: async (context) => {
			const results = await context.fanOut(
				['risk', 'response'] as const,
				async (focus) =>
					focus === 'risk'
						? { kind: 'risk' as const, value: await context.agents.assess_support_risk(context.input) }
						: { kind: 'response' as const, value: await context.agents.plan_support_response(context.input) },
				{ concurrency: 2 },
			)
			const risk = results.find((result) => result.kind === 'risk')
			const response = results.find((result) => result.kind === 'response')
			if (!risk || !response) throw new Error('Support analysis did not return both specialist results')
			return {
				caseId: context.input.caseId,
				risk: riskAssessmentSchema.parse(risk.value),
				response: responsePlanSchema.parse(response.value),
			}
		},
	})
	.define()
