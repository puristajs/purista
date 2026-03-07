import { describe, expect, it } from 'vitest'
import { InMemoryKnowledgeAdapter } from '../knowledge/adapters/inMemoryAdapter.js'
import { InMemorySessionStore } from '../memory/sessionStore.js'
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
			queries: string[] = []
			override async query(input: { query: string; limit?: number }) {
				this.queries.push(input.query)
				return super.query(input)
			}
		})()
		await adapter.upsert({ document: { id: 'doc-1', content: 'hello world' } })

		const sessionStore = new InMemorySessionStore()

		const executor = new AgentExecutor({
			manifest,
			provider: new DeterministicTextProvider(),
			sessionStore,
			knowledgeAdapters: { default: adapter },
			logger: { debug: () => undefined, warn: () => undefined } as any,
			startActiveSpan: async (_name, _attrs, _ctx, fn) => (fn ? fn({} as any) : Promise.resolve(undefined as never)),
		})

		const result = await executor.run({ sessionId: 's1', prompt: 'Hello', context: undefined })
		expect(result.output).toBe('Hello')
		expect(adapter.queries).toContain('Hello')
		const record = await sessionStore.load('s1')
		expect(record?.data.history).toHaveLength(2)
	})
})
