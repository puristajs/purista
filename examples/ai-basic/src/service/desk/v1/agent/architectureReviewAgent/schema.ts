import { extendApi } from '@purista/core'
import { z } from 'zod'

export const architectureReviewAgentInputSchema = extendApi(
	z.object({
		prompt: z.string().min(1),
		sessionId: z.string().min(1).optional(),
	}),
	{ title: 'Architecture review input' },
)

export const architectureReviewAgentResponseSchema = extendApi(
	z.object({
		overallVerdict: z.enum(['ready', 'needs-work', 'risky']).describe('Overall architecture readiness verdict.'),
		scorecard: z
			.object({
				readinessScore: z.number().int().min(0).max(100),
				riskScore: z.number().int().min(0).max(100),
				confidenceScore: z.number().int().min(0).max(100),
			})
			.describe('Top-line architecture review scores.'),
		dimensionScores: z
			.object({
				scalability: z.number().int().min(0).max(100),
				reliability: z.number().int().min(0).max(100),
				operability: z.number().int().min(0).max(100),
				security: z.number().int().min(0).max(100),
			})
			.describe('Dimension-level readiness scores used for visual summaries.'),
		executiveSummary: z.string().min(1).describe('Short top-line architecture summary.'),
		strengths: z.array(z.string().min(1)).min(1).describe('Key implementation strengths already present.'),
		risks: z.array(z.string().min(1)).min(1).describe('Most important technical or delivery risks.'),
		nextActions: z.array(z.string().min(1)).min(1).describe('Immediate next engineering actions.'),
	}),
	{ title: 'Architecture review response' },
)

export type ArchitectureReviewAgentInput = z.infer<typeof architectureReviewAgentInputSchema>
export type ArchitectureReviewAgentResponse = z.infer<typeof architectureReviewAgentResponseSchema>
