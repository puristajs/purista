import { describe, expect, it, vi } from 'vitest'
import { retrieveKnowledgeWorkflow } from './retrieveKnowledgeWorkflow.js'

const input = { collectionId: 'customer-help', query: 'How long are transfers pending?', limit: 4 }

describe('retrieveKnowledgeWorkflow', () => {
	it('embeds once and invokes the repository tool with stable managed call ids', async () => {
		const embed = vi.fn().mockResolvedValue({ embeddings: [{ index: 0, vector: [0.1, 0.2, 0.3, 0.4] }] })
		const output = {
			matches: [{ documentId: 'transfer-guide', chunkIndex: 0, content: 'Two business days.', score: 0.9 }],
		}
		const run = vi.fn().mockResolvedValue(output)

		await expect(
			retrieveKnowledgeWorkflow.handler({
				input,
				models: { embedding: { embed } },
				tools: { queryKnowledgeRepository: { run } },
			} as never),
		).resolves.toEqual(output)
		expect(embed).toHaveBeenCalledWith({ input: input.query }, { callId: 'embed-knowledge-query' })
		expect(run).toHaveBeenCalledWith(
			{ collectionId: input.collectionId, query: input.query, limit: input.limit, embedding: [0.1, 0.2, 0.3, 0.4] },
			{ callId: 'query-knowledge-repository' },
		)
	})

	it('does not query when the embedding is invalid', async () => {
		const run = vi.fn()
		await expect(
			retrieveKnowledgeWorkflow.handler({
				input,
				models: {
					embedding: { embed: vi.fn().mockResolvedValue({ embeddings: [{ index: 0, vector: [Number.NaN] }] }) },
				},
				tools: { queryKnowledgeRepository: { run } },
			} as never),
		).rejects.toThrow('The embedding model returned no query vector')
		expect(run).not.toHaveBeenCalled()
	})
})
