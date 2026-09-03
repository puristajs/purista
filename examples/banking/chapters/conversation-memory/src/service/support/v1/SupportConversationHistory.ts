export interface SupportConversationHistoryEntry {
	role: 'system' | 'user' | 'assistant' | 'tool'
	content: string
	timestamp: string
}

export interface SupportConversationHistory {
	list(sessionId: string): Promise<SupportConversationHistoryEntry[]>
	clear(sessionId: string): Promise<void>
}
