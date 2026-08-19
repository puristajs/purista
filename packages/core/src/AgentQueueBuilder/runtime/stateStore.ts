import type {
	FinishRunPatch,
	StateStore as HarnessStateStore,
	Message,
	PersistedRunEvent,
	RunRecord,
	SessionRecord,
} from '@purista/harness'
import { InMemoryStateStore, StateError } from '@purista/harness'
import type { StateWriteOptions } from '../../core/StateStore/types/StateRetention.js'
import type { StateStore as PuristaStateStore } from '../../core/StateStore/types/StateStore.js'
import type { AgentSessionRetentionPolicy } from '../types.js'

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
	retention?: AgentSessionRetentionPolicy
}): HarnessStateStore {
	return options.store
		? new PuristaHarnessStateStore(options.store, options.namespace, options.retention)
		: new InMemoryStateStore()
}

class PuristaHarnessStateStore implements HarnessStateStore {
	private readonly sessionLocks = new Map<string, MutexEntry>()
	private readonly maxRunsPerSession: number | undefined
	private readonly maxEventsPerRun: number | undefined

	constructor(
		private readonly store: PuristaStateStore,
		private readonly namespace: string,
		retention?: AgentSessionRetentionPolicy,
	) {
		this.writeOptions =
			retention?.idleTtlMs === undefined ? undefined : { retention: { mode: 'expire', ttlMs: retention.idleTtlMs } }
		this.maxRunsPerSession = retention?.runs?.maxPerSession
		this.maxEventsPerRun = retention?.events?.maxPerRun
	}

	private readonly writeOptions: StateWriteOptions | undefined

	async getSession(id: string): Promise<SessionRecord | undefined> {
		const record = await this.get<SessionRecord>(this.sessionKey(id))
		// Opening a session is activity. Refreshing this record keeps the
		// configured idle window honest even when a redelivered call is returned
		// from Harness idempotency without producing new transcript records.
		if (record && this.writeOptions) await this.set(this.sessionKey(id), record)
		return record
	}

	async upsertSession(record: SessionRecord): Promise<void> {
		await this.set(this.sessionKey(record.id), record)
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
			await this.set(this.messagesKey(sessionId), [...current, ...messages])
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
			await this.set(this.messagesKey(sessionId), [...messages])
		})
	}

	async createRun(record: RunRecord): Promise<void> {
		await this.withLock(this.sessionLocks, record.sessionId, async () => {
			const runIds = (await this.get<string[]>(this.sessionRunIndexKey(record.sessionId))) ?? []
			const nextRunIds = runIds.includes(record.id) ? runIds : [...runIds, record.id]
			if (!runIds.includes(record.id)) await this.set(this.sessionRunIndexKey(record.sessionId), nextRunIds)
			await this.set(this.runKey(record.id), record)
			await this.trimTerminalRuns(record.sessionId, nextRunIds)
		})
	}

	async finishRun(runId: string, patch: FinishRunPatch): Promise<void> {
		const initial = await this.get<RunRecord>(this.runKey(runId))
		if (!initial) return
		await this.withLock(this.sessionLocks, initial.sessionId, async () => {
			const current = await this.get<RunRecord>(this.runKey(runId))
			if (!current) return
			await this.set(this.runKey(runId), { ...current, ...patch })
			const runIds = (await this.get<string[]>(this.sessionRunIndexKey(current.sessionId))) ?? []
			await this.trimTerminalRuns(current.sessionId, runIds)
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
		const initial = await this.get<RunRecord>(this.runKey(runId))
		// The public Harness StateStore contract permits event-first persistence.
		// Without a run record there is no session key available for locking, so
		// retain that portable behavior while still applying a configured event
		// cap. Normal Harness execution creates the run first and follows the
		// session-serialized branch below.
		if (!initial) {
			const current = (await this.get<PersistedRunEvent[]>(this.eventsKey(runId))) ?? []
			await this.set(this.eventsKey(runId), this.boundEvents(current, events))
			return
		}
		await this.withLock(this.sessionLocks, initial.sessionId, async () => {
			// A concurrent terminal-run trim may have removed this record before
			// this writer acquired the session lock. Never recreate orphan events.
			if (!(await this.get<RunRecord>(this.runKey(runId)))) return
			const current = (await this.get<PersistedRunEvent[]>(this.eventsKey(runId))) ?? []
			await this.set(this.eventsKey(runId), this.boundEvents(current, events))
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

	private async set(key: string, value: unknown): Promise<void> {
		await this.store.setState(key, value, this.writeOptions)
	}

	private boundEvents(current: PersistedRunEvent[], additions: PersistedRunEvent[]): PersistedRunEvent[] {
		const combined = [...current, ...additions]
		return this.maxEventsPerRun === undefined
			? combined
			: combined.slice(Math.max(0, combined.length - this.maxEventsPerRun))
	}

	private async trimTerminalRuns(sessionId: string, runIds: readonly string[]): Promise<void> {
		if (this.maxRunsPerSession === undefined || runIds.length <= this.maxRunsPerSession) return
		const state = await this.store.getState(...runIds.map(runId => this.runKey(runId)))
		const remaining = [...runIds]
		for (const runId of runIds) {
			if (remaining.length <= this.maxRunsPerSession) break
			const run = state[this.runKey(runId)] as RunRecord | undefined
			if (!run || run.status === 'running') continue
			remaining.splice(remaining.indexOf(runId), 1)
			await this.store.removeState(this.runKey(runId))
			await this.store.removeState(this.eventsKey(runId))
		}
		if (remaining.length !== runIds.length) await this.set(this.sessionRunIndexKey(sessionId), remaining)
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
