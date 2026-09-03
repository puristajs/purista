import { afterAll, describe, expect, test } from 'vitest'
import { StaleKnowledgeRevisionError } from '../service/knowledge/v1/KnowledgeResources.js'
import { PgKnowledgeRepository } from './PgKnowledgeRepository.js'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is required for PostgreSQL tests')

const dimensions = 1_536
const model = 'text-embedding-3-small'
const repository = new PgKnowledgeRepository(databaseUrl, dimensions)
const vector = (first: number, second = 0) => [first, second, ...Array.from({ length: dimensions - 2 }, () => 0)]

afterAll(() => repository.destroy())

function revision(scope: string, number: number, content: string, embedding = vector(1)) {
	return {
		tenantId: `tenant-${scope}`,
		collectionId: 'customer-help',
		documentId: 'transfer-help',
		revision: number,
		title: 'Transfer help',
		embeddingModel: model,
		chunks: [{ index: 0, content, embedding }],
	}
}

describe('PgKnowledgeRepository', () => {
	test('atomically replaces newer revisions and rejects stale writes', async () => {
		await repository.replaceRevision(revision('replacement', 1, 'Old policy'))
		await repository.replaceRevision(revision('replacement', 2, 'Current policy'))
		await expect(repository.replaceRevision(revision('replacement', 2, 'Duplicate policy'))).rejects.toBeInstanceOf(
			StaleKnowledgeRevisionError,
		)

		await expect(
			repository.search({
				tenantId: 'tenant-replacement',
				collectionId: 'customer-help',
				embeddingModel: model,
				queryEmbedding: vector(1),
				limit: 4,
			}),
		).resolves.toMatchObject([{ documentId: 'transfer-help', chunkIndex: 0, content: 'Current policy' }])
	})

	test('rolls back the replacement when a vector is invalid', async () => {
		await repository.replaceRevision(revision('rollback', 1, 'Committed policy'))
		await expect(repository.replaceRevision(revision('rollback', 2, 'Broken policy', [1, 0]))).rejects.toThrow(
			'Expected 1536 finite embedding values',
		)

		await expect(
			repository.search({
				tenantId: 'tenant-rollback',
				collectionId: 'customer-help',
				embeddingModel: model,
				queryEmbedding: vector(1),
				limit: 4,
			}),
		).resolves.toMatchObject([{ content: 'Committed policy' }])
	})

	test('keeps retrieval inside the requested tenant and collection', async () => {
		await repository.replaceRevision(revision('scope', 1, 'Allowed policy'))
		await repository.replaceRevision({
			...revision('scope', 1, 'Private policy', vector(1, 0.1)),
			collectionId: 'private-help',
			documentId: 'private-transfer-help',
		})
		await repository.replaceRevision(revision('other', 1, 'Other tenant policy', vector(1, 0.1)))

		const matches = await repository.search({
			tenantId: 'tenant-scope',
			collectionId: 'customer-help',
			embeddingModel: model,
			queryEmbedding: vector(1),
			limit: 10,
		})
		expect(matches.map((match) => match.content)).toEqual(['Allowed policy'])
	})
})
