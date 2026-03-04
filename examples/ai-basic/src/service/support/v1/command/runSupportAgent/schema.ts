import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

export const runSupportAgentInputSchema = extendApi(
	z.object({
		sessionId: z.string().uuid().optional(),
		prompt: z.string().min(1),
		context: z.string().optional(),
	}),
	{ title: 'Run support agent input' },
)

export const runSupportAgentOutputSchema = extendApi(
	z.object({
		message: z.string(),
	}),
	{ title: 'Run support agent output' },
)
