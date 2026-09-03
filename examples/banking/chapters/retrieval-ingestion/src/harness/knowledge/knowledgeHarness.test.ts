import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { knowledgeHarness } from './knowledgeHarness.js'

const usage = { inputTokens: 4, outputTokens: 3, totalTokens: 7 }

describe('knowledgeHarness', () => {
	it('lets the retrieval agent choose the search tool and streams the grounded answer', async () => {
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
		provider.enqueueTextStream([
			{ kind: 'delta', text: 'They can remain pending for ' },
			{ kind: 'delta', text: 'two business days [transfer-guide#2].' },
			{ kind: 'finish', usage, finishReason: 'stop' },
		])
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
		const harness = await knowledgeHarness.getInstance({
			models: {
				primary: { provider, model: 'fake-knowledge-model' },
				embedding: { provider, model: 'fake-embedding-model' },
			},
			hostTools: { search_knowledge: search },
		})

		try {
			const session = await harness.getSession('knowledge-chat-1')
			const events = []
			for await (const event of session.workflows.answer_knowledge_question.stream(
				{
					collectionId: 'customer-help',
					question: 'How long are transfers pending?',
				},
				{ hostContext: { identity: { tenantId: 'tenant-example', principalId: 'principal-alex' } } },
			))
				events.push(event)

			expect(search).toHaveBeenCalledWith(expect.objectContaining({ agentId: 'retrieve_evidence' }), {
				collectionId: 'customer-help',
				query: 'How long are transfers pending?',
				limit: 4,
			})
			expect(events).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ type: 'tool.input.available', toolId: 'search_knowledge' }),
					expect.objectContaining({ type: 'tool.finished', toolId: 'search_knowledge' }),
					expect.objectContaining({ type: 'output.text.delta', delta: 'They can remain pending for ' }),
					expect.objectContaining({
						type: 'run.finished',
						outcome: expect.objectContaining({
							status: 'completed',
							output: 'They can remain pending for two business days [transfer-guide#2].',
						}),
					}),
				]),
			)
			provider.assertExhausted()
		} finally {
			await harness.shutdown()
		}
	})
})
