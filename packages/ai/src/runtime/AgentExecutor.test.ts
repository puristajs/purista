import { describe, expect, it, vi } from 'vitest'
import { InMemoryKnowledgeAdapter } from '../knowledge/adapters/inMemoryAdapter.js'
import { InMemoryConversationStore } from '../memory/conversationStore.js'
import type { ModelProvider, ProviderRequest } from '../providers/runtime/ModelProvider.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { AgentExecutor } from './AgentExecutor.js'

class DeterministicTextProvider implements ModelProvider {
	readonly name = 'deterministic-text'
	readonly capabilities = { text: true }

	async generate(request: ProviderRequest) {
		return {
			output: request.prompt,
			tokens: {
				prompt: request.prompt.length,
				completion: request.prompt.length,
			},
			costUsd: 0,
		}
	}
}

const manifest: AgentManifest = {
	agentName: 'test',
	agentVersion: '1',
	eventBridge: 'default',
	modelResource: { resourceName: 'deterministic-text' },
	allowedTools: [],
	knowledge: [{ adapterName: 'default' }],
}

describe('AgentExecutor', () => {
	it('runs prompts through the provider and stores session state', async () => {
		const adapter = new (class extends InMemoryKnowledgeAdapter {
			queries: Array<{ query: string; scope?: Record<string, unknown> }> = []
			override async query(input: { query: string; limit?: number; scope?: Record<string, unknown> }) {
				this.queries.push({ query: input.query, scope: input.scope })
				return super.query(input)
			}
		})()
		await adapter.upsert({ document: { id: 'doc-1', content: 'hello world' } })

		const conversationStore = new InMemoryConversationStore()

		const executor = new AgentExecutor({
			manifest,
			provider: new DeterministicTextProvider(),
			conversationStore,
			knowledgeAdapters: { default: adapter },
			logger: { debug: () => undefined, warn: () => undefined } as any,
			startActiveSpan: async (_name, _attrs, _ctx, fn) => (fn ? fn({} as any) : Promise.resolve(undefined as never)),
		})

		const result = await executor.run({ sessionId: 's1', prompt: 'Hello', context: undefined })
		expect(result.output).toBe('Hello')
		expect(adapter.queries).toContainEqual({
			query: 'Hello',
			scope: {
				agentName: 'test',
				agentVersion: '1',
				principalId: undefined,
				sessionId: 's1',
				tenantId: undefined,
			},
		})
		const record = await conversationStore.load('s1', { agentName: 'test', agentVersion: '1' })
		expect(record?.data.history).toHaveLength(2)
	})

	it('passes tenantId and principalId to conversation store', async () => {
		const conversationStore = {
			load: vi.fn().mockResolvedValue(undefined),
			save: vi.fn().mockResolvedValue(undefined),
			delete: vi.fn().mockResolvedValue(undefined),
		}

		const executor = new AgentExecutor({
			manifest,
			provider: new DeterministicTextProvider(),
			conversationStore: conversationStore as any,
			knowledgeAdapters: { default: new InMemoryKnowledgeAdapter() },
			logger: { debug: () => undefined, warn: () => undefined } as any,
			startActiveSpan: async (_name, _attrs, _ctx, fn) => (fn ? fn({} as any) : Promise.resolve(undefined as never)),
		})

		await executor.run({
			sessionId: 's1',
			prompt: 'Hello',
			tenantId: 'tenant-1',
			principalId: 'principal-1',
		})

		expect(conversationStore.load).toHaveBeenCalledWith('s1', {
			agentName: 'test',
			agentVersion: '1',
			tenantId: 'tenant-1',
			principalId: 'principal-1',
		})
		expect(conversationStore.save).toHaveBeenCalledWith(expect.objectContaining({ conversationId: 's1' }), {
			agentName: 'test',
			agentVersion: '1',
			tenantId: 'tenant-1',
			principalId: 'principal-1',
		})
	})

	it('passes session-aware scope to knowledge adapters', async () => {
		const adapter = {
			id: 'test-knowledge',
			upsert: vi.fn(),
			query: vi.fn().mockResolvedValue([{ id: 'doc-1', content: 'hello world' }]),
			delete: vi.fn(),
		}

		const executor = new AgentExecutor({
			manifest,
			provider: new DeterministicTextProvider(),
			conversationStore: new InMemoryConversationStore(),
			knowledgeAdapters: { default: adapter },
			logger: { debug: () => undefined, warn: () => undefined } as any,
			startActiveSpan: async (_name, _attrs, _ctx, fn) => (fn ? fn({} as any) : Promise.resolve(undefined as never)),
		})

		await executor.run({
			sessionId: 's1',
			prompt: 'Hello',
			tenantId: 'tenant-1',
			principalId: 'principal-1',
		})

		expect(adapter.query).toHaveBeenCalledWith({
			query: 'Hello',
			limit: 5,
			options: undefined,
			scope: {
				agentName: 'test',
				agentVersion: '1',
				tenantId: 'tenant-1',
				principalId: 'principal-1',
				sessionId: 's1',
			},
		})
	})
})
