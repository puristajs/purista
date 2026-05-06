import { extendApi } from '@purista/core'
import { z } from 'zod'

export const deskChatAgentInputSchema = extendApi(
	z.object({
		prompt: z.string().min(1),
		sessionId: z.string().min(1).optional(),
	}),
	{ title: 'Developer desk chat input' },
)

export const deskChatAgentResponseSchema = extendApi(
	z.object({
		answer: z.string().min(1),
	}),
	{ title: 'Developer desk chat response' },
)

export type DeskChatAgentInput = z.infer<typeof deskChatAgentInputSchema>
export type DeskChatAgentResponse = z.infer<typeof deskChatAgentResponseSchema>
