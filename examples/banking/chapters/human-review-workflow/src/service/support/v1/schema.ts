import { z } from 'zod'
import {
	reviewOutcomeSchema,
	type reviewSupportActionInputSchema,
} from '../../../harness/support/workflow/reviewSupportAction/reviewSupportActionWorkflow.js'

export const requestCardFreezeInputSchema = z.strictObject({
	requestId: z.string().regex(/^[A-Za-z0-9_.:@/-]{1,120}$/),
	cardId: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/),
	reason: z.string().trim().min(1).max(500),
})

export const reviewWaitingSchema = z.strictObject({
	status: z.literal('waiting'),
	requestId: z.string(),
	waitId: z.string(),
	runId: z.string(),
	deadline: z.string(),
})

export const reviewTerminalSchema = z.strictObject({
	status: reviewOutcomeSchema,
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
