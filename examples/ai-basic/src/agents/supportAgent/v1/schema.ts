import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

export const supportAgentInputSchema = extendApi(
	z.object({
		sessionId: extendApi(z.string().uuid().optional(), { title: 'Session identifier' }),
		prompt: extendApi(z.string().min(1), { title: 'User prompt' }),
		context: extendApi(z.string().optional(), { title: 'Optional extra context' }),
	}),
	{ title: 'Support Agent Input' },
)

export type SupportAgentInput = z.infer<typeof supportAgentInputSchema>
