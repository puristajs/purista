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
