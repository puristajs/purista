import { z } from 'zod'

export const statementAnalysisAccountIdSchema = z.enum(['account-a', 'account-c'])
export const statementAnalysisJobIdSchema = z.string().uuid()

/** A deliberately small, synthetic CSV accepted by the local tutorial. */
export const statementUploadSchema = z.object({
	accountId: statementAnalysisAccountIdSchema,
	fileName: z.string().regex(/^[a-z0-9][a-z0-9._-]{0,79}\.csv$/i),
	content: z.string().min(1).max(8_192),
	requestKey: z.string().regex(/^[a-z0-9][a-z0-9_-]{2,79}$/i),
})

export const statementAnalysisJobSchema = z.object({
	jobId: statementAnalysisJobIdSchema,
	accountId: statementAnalysisAccountIdSchema,
	requestedBy: z.enum(['alice', 'bob', 'carol', 'dana', 'erin']),
	requestKey: z.string(),
	status: z.enum(['queued', 'running', 'completed', 'failed']),
	createdAt: z.string().datetime(),
	completedAt: z.string().datetime().optional(),
	report: z
		.object({
			transactionCount: z.number().int().nonnegative(),
			totalMinor: z.number().int(),
			artifactName: z.literal('statement-analysis.json'),
		})
		.optional(),
	failure: z.enum(['sandbox-unavailable', 'invalid-statement', 'analysis-failed']).optional(),
})

export type StatementAnalysisJob = z.infer<typeof statementAnalysisJobSchema>
