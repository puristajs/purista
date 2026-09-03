import { defineHarnessModule } from '@purista/harness'
import { z } from 'zod'

export const reviewOutcomeSchema = z.enum(['approved', 'rejected', 'expired', 'cancelled'])

export const reviewSupportActionInputSchema = z.strictObject({
	waitId: z.string().min(1).max(200),
	deadline: z.iso.datetime({ offset: false, precision: 3 }),
	actionDigest: z.string().regex(/^[a-f0-9]{64}$/),
	definitionVersion: z.literal('support-card-freeze-v1'),
})

export const reviewSupportActionOutputSchema = z.strictObject({
	status: reviewOutcomeSchema,
})

export const reviewSupportActionWorkflow = defineHarnessModule()('support.workflow.review-support-action', {
	version: '1.0.0',
	register(builder) {
		return builder.workflow('review_support_action', {
			input: reviewSupportActionInputSchema,
			output: reviewSupportActionOutputSchema,
			handler: async (context) => {
				const outcome = await context.externalWait.wait({
					waitId: context.input.waitId,
					kind: 'human_review',
					schemaVersion: 'support-review-signal-v1',
					definitionVersion: context.input.definitionVersion,
					deadline: context.input.deadline,
				})
				return { status: outcome.status }
			},
		})
	},
})
