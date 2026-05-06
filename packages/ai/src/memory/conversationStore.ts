import type { ConversationState } from '../runtime/conversation.js'

/**
 * Canonical conversation record persisted by session helpers.
 */
export type ConversationStoreRecordData = Record<string, unknown> & {
	conversation?: ConversationState
}

/**
 * Basic record stored by {@link ConversationStore} implementations.
 */
export type ConversationStoreRecord = {
	conversationId: string
	data: ConversationStoreRecordData
	updatedAt: number
}

export type ConversationStoreScope = {
	tenantId?: string
	principalId?: string
	agentName?: string
	serviceVersion?: string
}

export interface ConversationStore {
	load(conversationId: string, scope?: ConversationStoreScope): Promise<ConversationStoreRecord | undefined>
	save(record: ConversationStoreRecord, scope?: ConversationStoreScope): Promise<void>
	delete(conversationId: string, scope?: ConversationStoreScope): Promise<void>
}

/**
 * Simple development-friendly conversation store that keeps state in memory.
 *
 * @example
 * ```ts
 * const store = new InMemoryConversationStore()
 * await store.save({ conversationId: 'demo', data: { conversation: { messages: [] } }, updatedAt: Date.now() })
 * ```
 */
export class InMemoryConversationStore implements ConversationStore {
	private readonly store = new Map<string, ConversationStoreRecord>()

	private getScopeKey(scope?: ConversationStoreScope) {
		if (!scope?.tenantId && !scope?.principalId && !scope?.agentName && !scope?.serviceVersion) {
			return undefined
		}
		return [scope.tenantId ?? '', scope.principalId ?? '', scope.agentName ?? '', scope.serviceVersion ?? ''].join(':')
	}

	private getKey(conversationId: string, scope?: ConversationStoreScope) {
		const scopeKey = this.getScopeKey(scope)
		return `${scopeKey ?? 'global'}::${conversationId}`
	}

	async load(conversationId: string, scope?: ConversationStoreScope) {
		return this.store.get(this.getKey(conversationId, scope))
	}

	async save(record: ConversationStoreRecord, scope?: ConversationStoreScope) {
		this.store.set(this.getKey(record.conversationId, scope), { ...record, updatedAt: Date.now() })
	}

	async delete(conversationId: string, scope?: ConversationStoreScope) {
		this.store.delete(this.getKey(conversationId, scope))
	}
}
