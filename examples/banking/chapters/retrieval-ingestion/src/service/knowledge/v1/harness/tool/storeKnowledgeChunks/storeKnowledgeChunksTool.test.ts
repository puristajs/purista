import { describe, expect, it, vi } from 'vitest'
import { storeKnowledgeChunksTool } from './storeKnowledgeChunksTool.js'

const input = {
	collectionId: 'customer-help',
	documentId: 'doc-1',
	revision: 1,
	title: 'Transfer help',
	chunks: [
		{ index: 0, content: 'First chunk', embedding: [0.1, 0.2] },
		{ index: 1, content: 'Second chunk', embedding: [0.3, 0.4] },
	],
}

function context() {
	const repository = { replaceRevision: vi.fn().mockResolvedValue(undefined), search: vi.fn() }
	return {
		repository,
		value: {
			identity: { tenantId: 'tenant-example', principalId: 'principal-alex' },
			resources: {
				knowledgeEmbeddingProfile: { model: 'text-embedding-example', dimensions: 2 },
				knowledgeRepository: repository,
			},
			signal: new AbortController().signal,
		},
	}
}

describe('storeKnowledgeChunksTool', () => {
	it('persists trusted tenant identity and the concrete embedding profile', async () => {
		const { repository, value } = context()

		await expect(storeKnowledgeChunksTool.handler(value as never, input)).resolves.toEqual({
			documentId: 'doc-1',
			revision: 1,
			chunkCount: 2,
			embeddingModel: 'text-embedding-example',
		})
		expect(repository.replaceRevision).toHaveBeenCalledWith(
			{
				tenantId: 'tenant-example',
				collectionId: 'customer-help',
				documentId: 'doc-1',
				revision: 1,
				title: 'Transfer help',
				embeddingModel: 'text-embedding-example',
				chunks: input.chunks,
			},
			value.signal,
		)
	})

	it.each([
		['out-of-order indexes', [{ ...input.chunks[0], index: 1 }, input.chunks[1]]],
		['wrong dimensions', [{ ...input.chunks[0], embedding: [0.1] }, input.chunks[1]]],
		['non-finite values', [{ ...input.chunks[0], embedding: [Number.NaN, 0.2] }, input.chunks[1]]],
	])('rejects %s before persistence', async (_label, chunks) => {
		const { repository, value } = context()

		await expect(
			storeKnowledgeChunksTool.handler(value as never, { ...input, chunks: [...chunks] }),
		).rejects.toMatchObject({
			errorCode: 400,
		})
		expect(repository.replaceRevision).not.toHaveBeenCalled()
	})
})
