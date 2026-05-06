import { extendApi } from '@purista/core'
import { z } from 'zod'

export const researchAgentInputSchema = extendApi(
	z.object({
		prompt: z.string().min(1),
		sessionId: z.string().min(1).optional(),
	}),
	{ title: 'Research agent input' },
)

export const researchAgentResponseSchema = extendApi(
	z.object({
		message: z.string().min(1),
		findings: z.array(z.string().min(1)).min(1),
		sources: z.array(z.string().min(1)).default([]),
	}),
	{ title: 'Research agent response' },
)

export type ResearchAgentInput = z.infer<typeof researchAgentInputSchema>
export type ResearchAgentResponse = z.infer<typeof researchAgentResponseSchema>
