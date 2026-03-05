import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

export const requestFollowUpInputSchema = extendApi(
	z.object({
		sessionId: z.string().min(1).optional(),
		prompt: z.string().min(1),
	}),
	{ title: 'Request follow-up input' },
)

export const requestFollowUpOutputSchema = extendApi(
	z.object({
		sessionId: z.string().optional(),
		prompt: z.string(),
		status: z.literal('queued'),
	}),
	{ title: 'Request follow-up output' },
)
