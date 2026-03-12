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

	it('isolates records by scope while keeping logical ids stable', async () => {
		const store = new InMemoryConversationStore()

		await store.save(
			{ conversationId: 's1', data: { owner: 'tenant-a' }, updatedAt: Date.now() },
			{ tenantId: 'tenant-a', principalId: 'user-1', agentName: 'supportAgent', agentVersion: '1' },
		)
		await store.save(
			{ conversationId: 's1', data: { owner: 'tenant-b' }, updatedAt: Date.now() },
			{ tenantId: 'tenant-b', principalId: 'user-1', agentName: 'supportAgent', agentVersion: '1' },
		)

		expect(
			await store.load('s1', {
				tenantId: 'tenant-a',
				principalId: 'user-1',
				agentName: 'supportAgent',
				agentVersion: '1',
			}),
		).toMatchObject({
			conversationId: 's1',
			data: { owner: 'tenant-a' },
		})
		expect(
			await store.load('s1', {
				tenantId: 'tenant-b',
				principalId: 'user-1',
				agentName: 'supportAgent',
				agentVersion: '1',
			}),
		).toMatchObject({
			conversationId: 's1',
			data: { owner: 'tenant-b' },
		})
		expect(
			await store.load('s1', {
				tenantId: 'tenant-c',
				principalId: 'user-1',
				agentName: 'supportAgent',
				agentVersion: '1',
			}),
		).toBeUndefined()
	})
})
