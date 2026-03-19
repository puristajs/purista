import { extendApi } from '@purista/core'
import { z } from 'zod'

export const bridgeDemoAgentInputSchema = extendApi(
	z.object({
		prompt: extendApi(z.string().min(1), { title: 'Support prompt' }),
		sessionId: extendApi(z.string().min(1).optional(), { title: 'Session identifier' }),
	}),
	{ title: 'Bridge Demo Agent Input' },
)

export type BridgeDemoAgentInput = z.infer<typeof bridgeDemoAgentInputSchema>
