import type { ConversationHistory } from './historyHelpers.js'

/**
 * Optional metadata stored alongside a session.
 */
export type ConversationStoreRecordData = Record<string, unknown> & {
	history?: ConversationHistory
	lastOutput?: string
}

/**
 * Basic record stored by {@link ConversationStore} implementations.
 */
export type ConversationStoreRecord = {
	conversationId: string
	data: ConversationStoreRecordData
	updatedAt: number
}

export interface ConversationStore {
	load(conversationId: string): Promise<ConversationStoreRecord | undefined>
	save(record: ConversationStoreRecord): Promise<void>
	delete(conversationId: string): Promise<void>
}

/**
 * Simple development-friendly conversation store that keeps state in memory.
 *
 * @example
 * ```ts
 * const store = new InMemoryConversationStore()
 * await store.save({ conversationId: 'demo', data: { lastOutput: 'hi' }, updatedAt: Date.now() })
 * ```
 */
export class InMemoryConversationStore implements ConversationStore {
	private readonly store = new Map<string, ConversationStoreRecord>()

	async load(conversationId: string) {
		return this.store.get(conversationId)
	}

	async save(record: ConversationStoreRecord) {
		this.store.set(record.conversationId, { ...record, updatedAt: Date.now() })
	}

	async delete(conversationId: string) {
		this.store.delete(conversationId)
	}
}
