import type {
	FinishRunPatch,
	StateStore as HarnessStateStore,
	Message,
	PersistedRunEvent,
	RunRecord,
	SessionRecord,
} from '@purista/harness'
import { InMemoryStateStore, StateError } from '@purista/harness'
import type { StateStore as PuristaStateStore } from '../../core/StateStore/types/StateStore.js'

/**
 * Adapts the service-owned PURISTA state store to the Harness persistence port.
 *
 * The service owns adapter lifecycle and supplies the namespace, so attached
 * agents share the application's configured storage without colliding with
 * business state or another attached agent.
 */
export function createPuristaHarnessStateStore(options: {
	store?: PuristaStateStore
	namespace: string
}): HarnessStateStore {
	return options.store ? new PuristaHarnessStateStore(options.store, options.namespace) : new InMemoryStateStore()
}

class PuristaHarnessStateStore implements HarnessStateStore {
	private readonly sessionLocks = new Map<string, MutexEntry>()
	private readonly runLocks = new Map<string, MutexEntry>()

	constructor(
		private readonly store: PuristaStateStore,
		private readonly namespace: string,
	) {}

	async getSession(id: string): Promise<SessionRecord | undefined> {
		return this.get<SessionRecord>(this.sessionKey(id))
	}

	async upsertSession(record: SessionRecord): Promise<void> {
		await this.store.setState(this.sessionKey(record.id), record)
	}

	async closeSession(id: string): Promise<void> {
		await this.withLock(this.sessionLocks, id, async () => {
			const runIds = (await this.get<readonly string[]>(this.sessionRunIndexKey(id))) ?? []
			await this.store.removeState(this.sessionKey(id))
			await this.store.removeState(this.messagesKey(id))
			await this.store.removeState(this.sessionRunIndexKey(id))
			for (const runId of runIds) {
				await this.store.removeState(this.runKey(runId))
				await this.store.removeState(this.eventsKey(runId))
			}
		})
	}

	async appendMessages(sessionId: string, messages: Message[]): Promise<void> {
		await this.withLock(this.sessionLocks, sessionId, async () => {
			const current = (await this.get<Message[]>(this.messagesKey(sessionId))) ?? []
			const ids = new Set(current.map(message => message.id))
			for (const message of messages) {
				if (ids.has(message.id)) {
					throw new StateError('Duplicate message id.', {
						op: 'appendMessages',
						reason: 'duplicate_message_id',
						adapter: 'purista',
					})
				}
				ids.add(message.id)
			}
			await this.store.setState(this.messagesKey(sessionId), [...current, ...messages])
		})
	}

	async listMessages(sessionId: string, opts: { limit?: number; before?: string } = {}): Promise<Message[]> {
		let rows = [...((await this.get<Message[]>(this.messagesKey(sessionId))) ?? [])].sort((a, b) =>
			a.timestamp === b.timestamp ? a.id.localeCompare(b.id) : a.timestamp.localeCompare(b.timestamp),
		)
		if (opts.before) {
			const beforeIndex = rows.findIndex(row => row.id === opts.before)
			if (beforeIndex >= 0) rows = rows.slice(0, beforeIndex)
		}
		return opts.limit === undefined ? rows : rows.slice(Math.max(0, rows.length - opts.limit))
	}

	async clearMessages(sessionId: string): Promise<void> {
		await this.withLock(this.sessionLocks, sessionId, () => this.store.removeState(this.messagesKey(sessionId)))
	}

	async replaceMessages(sessionId: string, messages: Message[]): Promise<void> {
		await this.withLock(this.sessionLocks, sessionId, async () => {
			const ids = new Set<string>()
			for (const message of messages) {
				if (ids.has(message.id)) {
					throw new StateError('Duplicate message id.', {
						op: 'replaceMessages',
						reason: 'duplicate_message_id',
						adapter: 'purista',
					})
				}
				ids.add(message.id)
			}
			await this.store.setState(this.messagesKey(sessionId), [...messages])
		})
	}

	async createRun(record: RunRecord): Promise<void> {
		await this.withLock(this.sessionLocks, record.sessionId, async () => {
			const runIds = (await this.get<string[]>(this.sessionRunIndexKey(record.sessionId))) ?? []
			if (!runIds.includes(record.id)) {
				await this.store.setState(this.sessionRunIndexKey(record.sessionId), [...runIds, record.id])
			}
			await this.store.setState(this.runKey(record.id), record)
		})
	}

	async finishRun(runId: string, patch: FinishRunPatch): Promise<void> {
		await this.withLock(this.runLocks, runId, async () => {
			const current = await this.get<RunRecord>(this.runKey(runId))
			if (current) await this.store.setState(this.runKey(runId), { ...current, ...patch })
		})
	}

	async getRun(runId: string): Promise<RunRecord | undefined> {
		return this.get<RunRecord>(this.runKey(runId))
	}

	async listRuns(sessionId: string, opts: { limit?: number; before?: string } = {}): Promise<RunRecord[]> {
		const runIds = (await this.get<string[]>(this.sessionRunIndexKey(sessionId))) ?? []
		const state = runIds.length === 0 ? {} : await this.store.getState(...runIds.map(runId => this.runKey(runId)))
		let rows = runIds
			.map(runId => state[this.runKey(runId)] as RunRecord | undefined)
			.filter((run): run is RunRecord => run !== undefined)
			.sort((a, b) => (a.startedAt === b.startedAt ? b.id.localeCompare(a.id) : b.startedAt.localeCompare(a.startedAt)))
		if (opts.before) {
			const beforeIndex = rows.findIndex(row => row.id === opts.before)
			if (beforeIndex >= 0) rows = rows.slice(beforeIndex + 1)
		}
		return opts.limit === undefined ? rows : rows.slice(0, opts.limit)
	}

	async appendEvents(runId: string, events: PersistedRunEvent[]): Promise<void> {
		await this.withLock(this.runLocks, runId, async () => {
			const current = (await this.get<PersistedRunEvent[]>(this.eventsKey(runId))) ?? []
			await this.store.setState(this.eventsKey(runId), [...current, ...events])
		})
	}

	async listEvents(runId: string, opts: { limit?: number; after?: string } = {}): Promise<PersistedRunEvent[]> {
		let rows = [...((await this.get<PersistedRunEvent[]>(this.eventsKey(runId))) ?? [])]
		if (opts.after) {
			const afterIndex = rows.findIndex(row => row.id === opts.after)
			if (afterIndex >= 0) rows = rows.slice(afterIndex + 1)
		}
		return opts.limit === undefined ? rows : rows.slice(0, opts.limit)
	}

	private async get<T>(key: string): Promise<T | undefined> {
		return (await this.store.getState(key))[key] as T | undefined
	}

	private sessionKey(sessionId: string): string {
		return this.key('session', sessionId)
	}

	private messagesKey(sessionId: string): string {
		return this.key('messages', sessionId)
	}

	private sessionRunIndexKey(sessionId: string): string {
		return this.key('session-runs', sessionId)
	}

	private runKey(runId: string): string {
		return this.key('run', runId)
	}

	private eventsKey(runId: string): string {
		return this.key('events', runId)
	}

	private key(kind: string, id: string): string {
		return `purista:harness:v2:${encodeURIComponent(this.namespace)}:${kind}:${encodeURIComponent(id)}`
	}

	private async withLock<T>(locks: Map<string, MutexEntry>, id: string, operation: () => Promise<T>): Promise<T> {
		let entry = locks.get(id)
		if (!entry) {
			entry = { mutex: new Mutex(), pending: 0 }
			locks.set(id, entry)
		}
		entry.pending += 1
		try {
			return await entry.mutex.run(operation)
		} finally {
			entry.pending -= 1
			if (entry.pending === 0 && locks.get(id) === entry) locks.delete(id)
		}
	}
}

interface MutexEntry {
	readonly mutex: Mutex
	pending: number
}

class Mutex {
	private current = Promise.resolve()

	async run<T>(operation: () => Promise<T>): Promise<T> {
		const previous = this.current
		let release: (() => void) | undefined
		this.current = new Promise<void>(resolve => {
			release = resolve
		})
		await previous
		try {
			return await operation()
		} finally {
			release?.()
		}
	}
}
