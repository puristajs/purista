import { describe, expect, it, vi } from 'vitest'
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
}

describe('AgentExecutor', () => {
	it('runs prompts through the provider and stores session state', async () => {
		const conversationStore = new InMemoryConversationStore()

		const executor = new AgentExecutor({
			manifest,
			provider: new DeterministicTextProvider(),
			conversationStore,
			logger: { debug: () => undefined, warn: () => undefined } as any,
			startActiveSpan: async (_name, _attrs, _ctx, fn) => (fn ? fn({} as any) : Promise.resolve(undefined as never)),
		})

		const result = await executor.run({ sessionId: 's1', prompt: 'Hello', context: 'System context' })
		expect(result.output).toBe('Hello')
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
})
