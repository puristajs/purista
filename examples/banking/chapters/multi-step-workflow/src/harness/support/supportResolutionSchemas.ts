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
