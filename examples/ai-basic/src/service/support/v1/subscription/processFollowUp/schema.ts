import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

export const processFollowUpInputSchema = extendApi(
	z.object({
		sessionId: z.string().uuid().optional(),
		prompt: z.string().min(1),
		status: z.literal('queued'),
	}),
	{ title: 'Process follow-up input' },
)
