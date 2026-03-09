/**
 * A single frame in a conversation history.
 */
export type ConversationFrame = {
	role: 'user' | 'assistant' | 'system' | 'developer'
	content: string
	timestamp: number
}

export type ConversationHistory = ConversationFrame[]

/** Append a new message to the history immutably. */
export const appendMessage = (history: ConversationHistory, frame: ConversationFrame): ConversationHistory => {
	return [...history, frame]
}

/** Trims a history to the last `maxTokens` frames. */
export const trimHistory = (history: ConversationHistory, maxTokens: number): ConversationHistory => {
	if (history.length <= maxTokens) {
		return history
	}
	return history.slice(history.length - maxTokens)
}

/** Convert the history into a plain-text transcript for summaries or providers without native memory. */
export const summarizeHistory = (history: ConversationHistory): string => {
	return history.map(frame => `${frame.role}: ${frame.content}`).join('\n')
}
