import { describe, expect, it } from 'vitest'

import { InMemoryConversationStore } from './conversationStore.js'

describe('InMemoryConversationStore', () => {
	it('saves and loads sessions', async () => {
		const store = new InMemoryConversationStore()
		await store.save({ conversationId: 's1', data: { foo: 'bar' }, updatedAt: Date.now() })
		const record = await store.load('s1')
		expect(record?.data.foo).toBe('bar')
		await store.delete('s1')
		expect(await store.load('s1')).toBeUndefined()
	})
})
