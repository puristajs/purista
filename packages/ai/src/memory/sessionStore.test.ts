import { describe, expect, it } from 'vitest'

import { InMemorySessionStore } from './sessionStore.js'

describe('InMemorySessionStore', () => {
	it('saves and loads sessions', async () => {
		const store = new InMemorySessionStore()
		await store.save({ sessionId: 's1', data: { foo: 'bar' }, updatedAt: Date.now() })
		const record = await store.load('s1')
		expect(record?.data.foo).toBe('bar')
		await store.delete('s1')
		expect(await store.load('s1')).toBeUndefined()
	})
})
