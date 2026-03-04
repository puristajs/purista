import { describe, expect, it } from 'vitest'
import { InMemorySessionStore } from '../memory/sessionStore.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { createConversationHelpers } from './conversation.js'

const createSessionHelpers = (sessionId = 'session-1') => {
	const store = new InMemorySessionStore()
	return {
		load: () => store.load(sessionId),
		save: async (record: { data: Record<string, unknown>; updatedAt?: number }) =>
			store.save({
				sessionId,
				data: record.data,
				updatedAt: record.updatedAt ?? Date.now(),
			}),
	}
}

describe('conversation helpers', () => {
	it('appends and returns messages with standard shape', async () => {
		const manifest: AgentManifest = {
			agentName: 'supportAgent',
			agentVersion: '1',
			eventBridge: 'default',
			allowedTools: [],
			session: { storeName: 'history', strategy: 'full', maxFrames: 10 },
		}
		const conversation = createConversationHelpers(createSessionHelpers(), manifest)

		await conversation.addUser('hello')
		await conversation.addAssistant('hi there')

		const messages = await conversation.getMessages()
		expect(messages).toHaveLength(2)
		expect(messages[0]?.role).toBe('user')
		expect(messages[1]?.role).toBe('assistant')
		expect(messages[0]?.id).toBeTruthy()
		expect(messages[0]?.createdAt).toBeTypeOf('number')
	})

	it('creates and uses summary automatically for summary strategy', async () => {
		const manifest: AgentManifest = {
			agentName: 'supportAgent',
			agentVersion: '1',
			eventBridge: 'default',
			allowedTools: [],
			session: { storeName: 'history', strategy: 'summary', maxFrames: 2 },
		}
		const conversation = createConversationHelpers(createSessionHelpers(), manifest)

		await conversation.addUser('A')
		await conversation.addAssistant('B')
		await conversation.addUser('C')

		const state = await conversation.get()
		expect(state.messages).toHaveLength(2)
		expect(state.summary).toContain('user: A')

		const promptInput = await conversation.buildPromptInput()
		expect(promptInput).toContain('summary: user: A')
		expect(promptInput).toContain('assistant: B')
		expect(promptInput).toContain('user: C')
	})
})
