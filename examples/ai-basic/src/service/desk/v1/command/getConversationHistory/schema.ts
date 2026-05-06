import { extendApi } from '@purista/core'
import { z } from 'zod'

export const getConversationHistoryInputSchema = extendApi(
	z.object({
		sessionId: z.string().min(1),
		scenario: z.enum(['chat', 'research', 'planner', 'structured', 'reflection']),
	}),
	{ title: 'Conversation history request' },
)

export const getConversationHistoryOutputSchema = extendApi(
	z.object({
		found: z.boolean(),
		messages: z.array(
			z.object({
				id: z.string(),
				role: z.enum(['system', 'developer', 'user', 'assistant', 'tool', 'tool_result']),
				content: z.string(),
				createdAt: z.number(),
				toolName: z.string().optional(),
				toolCallId: z.string().optional(),
				metadata: z.record(z.string(), z.unknown()).optional(),
			}),
		),
	}),
	{ title: 'Conversation history response' },
)

export type GetConversationHistoryInput = z.infer<typeof getConversationHistoryInputSchema>
