import { extendApi } from '@purista/core'
import { z } from 'zod'

export const getRecentConversationHistoryInputSchema = extendApi(
	z.object({
		limit: z.number().int().min(1).max(50).optional(),
	}),
	{ title: 'Recent conversation history request' },
)

export const getRecentConversationHistoryOutputSchema = extendApi(
	z.object({
		items: z.array(
			z.object({
				sessionId: z.string(),
				scenario: z.enum(['chat', 'research', 'planner', 'structured', 'reflection']),
				firstMessage: z.string(),
				updatedAt: z.number(),
			}),
		),
	}),
	{ title: 'Recent conversation history response' },
)
