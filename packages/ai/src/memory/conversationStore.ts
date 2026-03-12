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

export type ConversationStoreScope = {
	tenantId?: string
	principalId?: string
	agentName?: string
	agentVersion?: string
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
 * await store.save({ conversationId: 'demo', data: { lastOutput: 'hi' }, updatedAt: Date.now() })
 * ```
 */
export class InMemoryConversationStore implements ConversationStore {
	private readonly store = new Map<string, ConversationStoreRecord>()

	private getScopeKey(scope?: ConversationStoreScope) {
		if (!scope?.tenantId && !scope?.principalId && !scope?.agentName && !scope?.agentVersion) {
			return undefined
		}
		return [scope.tenantId ?? '', scope.principalId ?? '', scope.agentName ?? '', scope.agentVersion ?? ''].join(':')
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
