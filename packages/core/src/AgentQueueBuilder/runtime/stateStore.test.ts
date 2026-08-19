import { stateStoreContract } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import type { StateWriteOptions } from '../../core/StateStore/types/StateRetention.js'
import type { StateStore as PuristaStateStore } from '../../core/StateStore/types/StateStore.js'
import { createPuristaHarnessStateStore } from './stateStore.js'

function createStateStore(): PuristaStateStore & {
	readonly values: Map<string, unknown>
	readonly writes: Array<{ name: string; options?: StateWriteOptions }>
} {
	const values = new Map<string, unknown>()
	const writes: Array<{ name: string; options?: StateWriteOptions }> = []
	return {
		name: 'test',
		values,
		writes,
		async getState(...names: string[]) {
			return Object.fromEntries(names.map(name => [name, values.get(name)])) as never
		},
		async setState(name, value, options) {
			values.set(name, value)
			writes.push({ name, options })
		},
		async removeState(name) {
			values.delete(name)
		},
		async destroy() {},
	}
}

describe('PURISTA Harness state-store adapter', () => {
	it('persists Harness session, history, runs, and events in the configured PURISTA state store', async () => {
		const coreStore = createStateStore()
		const store = createPuristaHarnessStateStore({ store: coreStore, namespace: 'support:1:triage' })

		await store.upsertSession({
			id: 'session',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-01T00:00:00.000Z',
			runCount: 1,
		})
		await store.appendMessages('session', [
			{ id: 'message-b', sessionId: 'session', role: 'assistant', content: 'b', timestamp: '2026-01-01T00:00:02.000Z' },
			{ id: 'message-a', sessionId: 'session', role: 'user', content: 'a', timestamp: '2026-01-01T00:00:01.000Z' },
		])
		await store.createRun({
			id: 'run',
			sessionId: 'session',
			kind: 'agent',
			target: 'triage',
			startedAt: '2026-01-01T00:00:01.000Z',
			status: 'running',
		})
		await store.finishRun('run', { status: 'succeeded', finishedAt: '2026-01-01T00:00:03.000Z', output: { ok: true } })
		await store.appendEvents('run', [
			{
				id: 'event-a',
				runId: 'run',
				at: '2026-01-01T00:00:02.000Z',
				type: 'response.completed',
				payload: { ok: true },
			},
		])

		expect(await store.getSession('session')).toMatchObject({ id: 'session' })
		expect((await store.listMessages('session')).map(message => message.id)).toEqual(['message-a', 'message-b'])
		expect(await store.listRuns('session')).toMatchObject([{ id: 'run', status: 'succeeded' }])
		expect(await store.listEvents('run')).toMatchObject([{ id: 'event-a' }])
		expect([...coreStore.values.keys()].every(key => key.startsWith('purista:harness:v2:support%3A1%3Atriage:'))).toBe(
			true,
		)

		await store.closeSession('session')

		expect(await store.getSession('session')).toBeUndefined()
		expect(await store.listMessages('session')).toEqual([])
		expect(await store.getRun('run')).toBeUndefined()
		expect(await store.listEvents('run')).toEqual([])
	})

	it('uses the agent idle policy for every service-backed Harness record', async () => {
		const coreStore = createStateStore()
		const store = createPuristaHarnessStateStore({
			store: coreStore,
			namespace: 'support:1:triage',
			retention: { idleTtlMs: 60_000 },
		})

		await store.upsertSession({
			id: 'session',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-01T00:00:00.000Z',
			runCount: 0,
		})
		await store.appendMessages('session', [
			{ id: 'message', sessionId: 'session', role: 'user', content: 'hello', timestamp: '2026-01-01T00:00:00.000Z' },
		])

		expect(coreStore.writes).toEqual(
			expect.arrayContaining([expect.objectContaining({ options: { retention: { mode: 'expire', ttlMs: 60_000 } } })]),
		)
	})

	it('bounds terminal runs and per-run events without removing active work', async () => {
		const coreStore = createStateStore()
		const store = createPuristaHarnessStateStore({
			store: coreStore,
			namespace: 'support:1:triage',
			retention: { runs: { maxPerSession: 1 }, events: { maxPerRun: 2 } },
		})
		const running = (id: string) => ({
			id,
			sessionId: 'session',
			kind: 'agent' as const,
			target: 'triage',
			startedAt: `2026-01-01T00:00:0${id}.000Z`,
			status: 'running' as const,
		})

		await store.createRun(running('1'))
		await store.finishRun('1', { status: 'succeeded', finishedAt: '2026-01-01T00:00:02.000Z' })
		await store.createRun(running('2'))
		await store.appendEvents(
			'2',
			['a', 'b', 'c'].map((id, index) => ({
				id,
				runId: '2',
				at: `2026-01-01T00:00:0${index}.000Z`,
				type: 'response.completed',
				payload: {},
			})),
		)

		expect(await store.getRun('1')).toBeUndefined()
		expect(await store.listRuns('session')).toMatchObject([{ id: '2', status: 'running' }])
		expect((await store.listEvents('2')).map(event => event.id)).toEqual(['b', 'c'])
	})
})

stateStoreContract(() => createPuristaHarnessStateStore({ store: createStateStore(), namespace: 'contract' }))
