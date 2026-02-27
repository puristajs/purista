import type { ConversationHistory } from './historyHelpers.js'

/**
 * Optional metadata stored alongside a session.
 */
export type SessionRecordData = Record<string, unknown> & {
	history?: ConversationHistory
	lastOutput?: string
}

/**
 * Basic record stored by {@link SessionStore} implementations.
 */
export type SessionRecord = {
	sessionId: string
	data: SessionRecordData
	updatedAt: number
}

export interface SessionStore {
	load(sessionId: string): Promise<SessionRecord | undefined>
	save(record: SessionRecord): Promise<void>
	delete(sessionId: string): Promise<void>
}

/**
 * Simple development-friendly session store that keeps state in memory.
 *
 * @example
 * ```ts
 * const store = new InMemorySessionStore()
 * await store.save({ sessionId: 'demo', data: { lastOutput: 'hi' }, updatedAt: Date.now() })
 * ```
 */
export class InMemorySessionStore implements SessionStore {
	private readonly store = new Map<string, SessionRecord>()

	async load(sessionId: string) {
		return this.store.get(sessionId)
	}

	async save(record: SessionRecord) {
		this.store.set(record.sessionId, { ...record, updatedAt: Date.now() })
	}

	async delete(sessionId: string) {
		this.store.delete(sessionId)
	}
}
