import { defineHarness, isHarnessError } from '@purista/harness'
import { z } from 'zod'

export const supportResolutionInputSchema = z.strictObject({
	caseId: z.string().trim().min(1).max(80),
	message: z.string().trim().min(1).max(2_000),
})

export const supportClassificationSchema = z.strictObject({
	category: z.enum(['account_access', 'card', 'transfer', 'other']),
	urgency: z.enum(['normal', 'urgent']),
})

export const resolutionPlanInputSchema = z.strictObject({
	caseId: z.string(),
	message: z.string(),
	classification: supportClassificationSchema,
})

export const resolutionPlanSchema = z.strictObject({
	summary: z.string().trim().min(1).max(300),
	nextAction: z.enum(['reply', 'verify_identity', 'freeze_card', 'escalate']),
})

export const supportResolutionOutputSchema = z.strictObject({
	caseId: z.string(),
	classification: supportClassificationSchema,
	plan: resolutionPlanSchema,
})

export const supportResolutionHarness = defineHarness({ name: 'support-resolution' })
	.requireModel('classification_model', { capabilities: ['object'] })
	.requireModel('resolution_model', { capabilities: ['object'] })
	.agent('classify_support_case', {
		model: 'classification_model',
		input: supportResolutionInputSchema,
		output: supportClassificationSchema,
		instructions: 'Classify one Example Bank support case using only the supplied message.',
	})
	.agent('plan_support_resolution', {
		model: 'resolution_model',
		input: resolutionPlanInputSchema,
		output: resolutionPlanSchema,
		instructions: 'Create a concise next-step plan grounded in the message and validated classification.',
	})
	.workflow('resolve_support_case', {
		input: supportResolutionInputSchema,
		output: supportResolutionOutputSchema,
		delegation: {
			agents: ['classify_support_case', 'plan_support_resolution'],
			maxChildAgentCalls: 3,
			maxParallelChildAgentCalls: 1,
		},
		handler: async (context) => {
			const classification = supportClassificationSchema.parse(
				await context.step('classify-case-v1', () => context.agents.classify_support_case(context.input)),
			)
			const plan = resolutionPlanSchema.parse(
				await context.step(
					'plan-resolution-v1',
					() => context.agents.plan_support_resolution({ ...context.input, classification }),
					{
						retry: {
							maxAttempts: 2,
							minDelayMs: 100,
							maxDelayMs: 1_000,
							backoff: 'exponential',
							shouldRetry: (error) => isHarnessError(error) && error.retriable,
						},
					},
				),
			)
			return { caseId: context.input.caseId, classification, plan }
		},
	})
	.define()
