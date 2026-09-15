import { describe, expect, it, vi } from 'vitest'
import { ingestKnowledgeWorkflow } from './ingestKnowledgeWorkflow.js'

const words = Array.from({ length: 81 }, (_, index) => `word-${index}`)
const input = {
	collectionId: 'customer-help',
	documentId: 'doc-1',
	revision: 1,
	title: 'Transfer help',
	content: words.join(' '),
}

describe('ingestKnowledgeWorkflow', () => {
	it('chunks in order and uses stable managed call ids for embedding and persistence', async () => {
		const embed = vi.fn().mockResolvedValue({
			embeddings: [
				{ index: 1, vector: [0.3, 0.4] },
				{ index: 0, vector: [0.1, 0.2] },
			],
			usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
		})
		const run = vi.fn().mockResolvedValue({
			documentId: 'doc-1',
			revision: 1,
			chunkCount: 2,
			embeddingModel: 'text-embedding-example',
		})

		await expect(
			ingestKnowledgeWorkflow.handler({
				input,
				models: { embedding: { embed } },
				tools: { storeKnowledgeChunks: { run } },
			} as never),
		).resolves.toMatchObject({ documentId: 'doc-1', chunkCount: 2 })
		expect(embed).toHaveBeenCalledWith(
			{ input: [words.slice(0, 80).join(' '), words[80]] },
			{ callId: 'embed-knowledge-chunks' },
		)
		expect(run).toHaveBeenCalledWith(
			{
				collectionId: 'customer-help',
				documentId: 'doc-1',
				revision: 1,
				title: 'Transfer help',
				chunks: [
					{ index: 0, content: words.slice(0, 80).join(' '), embedding: [0.1, 0.2] },
					{ index: 1, content: words[80], embedding: [0.3, 0.4] },
				],
			},
			{ callId: 'store-knowledge-chunks' },
		)
	})

	it('rejects an invalid embedding response before persistence', async () => {
		const run = vi.fn()
		const embed = vi.fn().mockResolvedValue({
			embeddings: [{ index: 0, vector: [Number.NaN, 0.2] }],
			usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
		})

		await expect(
			ingestKnowledgeWorkflow.handler({
				input,
				models: { embedding: { embed } },
				tools: { storeKnowledgeChunks: { run } },
			} as never),
		).rejects.toThrow('The embedding model returned invalid document vectors')
		expect(run).not.toHaveBeenCalled()
	})
})
