import { z } from 'zod'

export const conversationIdSchema = z.string().regex(/^[A-Za-z0-9_-]{1,80}$/)

export const conversationHistoryRequestSchema = z.strictObject({ conversationId: conversationIdSchema })

export const conversationHistoryEntrySchema = z.strictObject({
	role: z.enum(['system', 'user', 'assistant', 'tool']),
	content: z.string(),
	timestamp: z.string(),
})

export const conversationHistorySchema = z.strictObject({
	messages: z.array(conversationHistoryEntrySchema),
})

export const clearedConversationHistorySchema = z.strictObject({ cleared: z.literal(true) })
