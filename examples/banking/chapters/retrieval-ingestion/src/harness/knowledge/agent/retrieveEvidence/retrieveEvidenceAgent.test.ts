import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { knowledgeHarness } from '../../knowledgeHarness.js'

const usage = { inputTokens: 4, outputTokens: 3, totalTokens: 7 }

describe('retrieveEvidenceAgent', () => {
	it('lets the model choose the declared search tool', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: {},
			toolCalls: [
				{
					id: 'search-1',
					name: 'search_knowledge',
					arguments: { collectionId: 'customer-help', query: 'How long are transfers pending?', limit: 4 },
				},
			],
			usage,
			finishReason: 'tool_calls',
		})
		provider.enqueueObject({
			object: {
				question: 'How long are transfers pending?',
				evidence: [
					{
						documentId: 'transfer-guide',
						chunkIndex: 2,
						content: 'International transfers can remain pending for two business days.',
						score: 0.94,
					},
				],
			},
			usage,
			finishReason: 'stop',
		})
		const search = vi.fn(async () => ({
			matches: [
				{
					documentId: 'transfer-guide',
					chunkIndex: 2,
					content: 'International transfers can remain pending for two business days.',
					score: 0.94,
				},
			],
		}))
		const runtime = await knowledgeHarness.getInstance({
			models: {
				primary: { provider, model: 'fake-knowledge-model' },
				embedding: { provider, model: 'fake-embedding-model' },
			},
			hostTools: { search_knowledge: search },
		})

		try {
			const session = await runtime.getSession('retrieve-evidence-1')
			await expect(
				session.agents.retrieve_evidence.run(
					{
						collectionId: 'customer-help',
						question: 'How long are transfers pending?',
					},
					{ hostContext: { identity: { tenantId: 'tenant-example', principalId: 'principal-alex' } } },
				),
			).resolves.toMatchObject({
				status: 'completed',
				output: { evidence: [expect.objectContaining({ documentId: 'transfer-guide', chunkIndex: 2 })] },
			})
			expect(search).toHaveBeenCalledOnce()
			provider.assertExhausted()
		} finally {
			await runtime.shutdown()
		}
	})
})
