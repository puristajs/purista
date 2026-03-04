import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

export const triageAgentInputSchema = extendApi(
	z.object({
		prompt: z.string().min(1),
		sessionId: z.string().uuid().optional(),
	}),
	{ title: 'Triage agent input' },
)

export type TriageAgentInput = z.infer<typeof triageAgentInputSchema>
