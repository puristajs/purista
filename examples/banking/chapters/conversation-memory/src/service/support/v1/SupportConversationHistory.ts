import type { z } from 'zod'
import type { conversationHistoryEntrySchema } from './schema.js'

export type SupportConversationHistoryEntry = z.output<typeof conversationHistoryEntrySchema>

export interface SupportConversationHistory {
	list(sessionId: string): Promise<SupportConversationHistoryEntry[]>
	clear(sessionId: string): Promise<void>
}
