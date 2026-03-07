import { agentProtocolEnvelopeSchema } from '@purista/ai'
import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

export const getConversationInputSchema = extendApi(
	z.object({
		sessionId: z.string().min(1),
	}),
	{ title: 'Get conversation input' },
)

export const getConversationOutputSchema = extendApi(
	z.object({
		sessionId: z.string(),
		conversationId: z.string().optional(),
		updatedAt: z.number().optional(),
		envelopes: agentProtocolEnvelopeSchema.array(),
	}),
	{ title: 'Get conversation output' },
)
