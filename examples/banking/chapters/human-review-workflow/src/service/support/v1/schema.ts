import { z } from 'zod'

export const reviewOutcomeSchema = z.literal('reviewed')

export const reviewSupportActionInputSchema = z.strictObject({
	requestId: z.string().min(1).max(120),
	actionDigest: z.string().regex(/^[a-f0-9]{64}$/),
	definitionVersion: z.literal('support-card-freeze-v1'),
})

export const reviewSupportActionOutputSchema = z.strictObject({ status: reviewOutcomeSchema })

export const freezeReviewedCardInputSchema = z.strictObject({})

export const requestCardFreezeInputSchema = z.strictObject({
	requestId: z.string().regex(/^[A-Za-z0-9_.:@/-]{1,120}$/),
	cardId: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/),
	reason: z.string().trim().min(1).max(500),
})

export const reviewWaitingSchema = z.strictObject({
	status: z.literal('waiting'),
	requestId: z.string(),
	approvalId: z.string(),
	interruptId: z.string(),
	revision: z.string(),
	runId: z.string(),
})

export const reviewTerminalSchema = z.strictObject({
	status: z.enum(['approved', 'rejected']),
	requestId: z.string(),
})

export const reviewRequestResultSchema = z.union([reviewWaitingSchema, reviewTerminalSchema])

export const decideReviewInputSchema = z.strictObject({
	requestId: z.string().regex(/^[A-Za-z0-9_.:@/-]{1,120}$/),
	expectedRevision: z.number().int().positive(),
	eventId: z.string().regex(/^[A-Za-z0-9_.:@/-]{1,120}$/),
	outcome: z.enum(['approved', 'rejected']),
})

export type ReviewWorkflowInput = z.output<typeof reviewSupportActionInputSchema>
