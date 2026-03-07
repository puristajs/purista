import type { AgentProtocolEnvelope } from '@purista/ai'

type ConversationSnapshot = {
	sessionId: string
	conversationId?: string
	envelopes: AgentProtocolEnvelope[]
	updatedAt: number
}

const store = new Map<string, ConversationSnapshot>()

export const saveConversationSnapshot = (sessionId: string, envelopes: AgentProtocolEnvelope[]): void => {
	if (!sessionId) {
		return
	}
	store.set(sessionId, {
		sessionId,
		conversationId: envelopes.at(-1)?.conversationId,
		envelopes,
		updatedAt: Date.now(),
	})
}

export const loadConversationSnapshot = (sessionId: string): ConversationSnapshot | undefined => store.get(sessionId)
