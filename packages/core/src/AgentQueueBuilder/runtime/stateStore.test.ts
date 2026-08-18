import { stateStoreContract } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import type { StateStore as PuristaStateStore } from '../../core/StateStore/types/StateStore.js'
import { createPuristaHarnessStateStore } from './stateStore.js'

function createStateStore(): PuristaStateStore & { readonly values: Map<string, unknown> } {
	const values = new Map<string, unknown>()
	return {
		name: 'test',
		values,
		async getState(...names: string[]) {
			return Object.fromEntries(names.map(name => [name, values.get(name)])) as never
		},
		async setState(name, value) {
			values.set(name, value)
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
})

stateStoreContract(() => createPuristaHarnessStateStore({ store: createStateStore(), namespace: 'contract' }))
