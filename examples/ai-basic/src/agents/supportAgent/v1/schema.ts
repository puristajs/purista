import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

export const supportAgentInputSchema = extendApi(
	z
		.object({
			sessionId: extendApi(z.string().min(1).optional(), { title: 'Session identifier' }),
			prompt: extendApi(z.string().min(1).optional(), { title: 'User prompt' }),
			message: extendApi(z.string().min(1).optional(), { title: 'Agent protocol compatible message field' }),
			context: extendApi(z.string().optional(), { title: 'Optional extra context' }),
			responseFormat: extendApi(z.enum(['text', 'json']).optional(), { title: 'Preferred response format' }),
			conversationId: extendApi(z.string().optional(), { title: 'Optional conversation id for compatibility' }),
			history: extendApi(z.array(z.unknown()).optional(), { title: 'Optional conversation history' }),
			attachments: extendApi(z.array(z.unknown()).optional(), { title: 'Optional attachments' }),
		})
		.refine(input => Boolean(input.prompt ?? input.message), {
			message: 'Either prompt or message must be provided',
		}),
	{ title: 'Support Agent Input' },
)

export type SupportAgentInput = z.infer<typeof supportAgentInputSchema>
