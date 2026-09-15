import { afterAll, describe, expect, test } from 'vitest'
import { demoEmbeddingModel, StaleKnowledgeRevisionError } from '../service/knowledge/v1/KnowledgeResources.js'
import { PgKnowledgeRepository } from './PgKnowledgeRepository.js'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is required for PostgreSQL tests')
const repository = new PgKnowledgeRepository(databaseUrl)
afterAll(() => repository.destroy())

const vector = [1, 0, 0, 0]
const replacement = (scope: string, revision: number, content: string, embedding = vector) => ({
	tenantId: `tenant-${scope}`,
	collectionId: 'policy-help',
	documentId: 'card-help',
	revision,
	title: 'Card help',
	embeddingModel: demoEmbeddingModel,
	chunks: [{ index: 0, content, embedding }],
})

describe('PgKnowledgeRepository', () => {
	test('replaces a newer revision and rejects a stale revision', async () => {
		await repository.replaceRevision(replacement('replace', 1, 'old text'))
		await repository.replaceRevision(replacement('replace', 2, 'new text'))
		await expect(repository.replaceRevision(replacement('replace', 2, 'duplicate')))
			.rejects.toBeInstanceOf(StaleKnowledgeRevisionError)
		const results = await repository.search({
			tenantId: 'tenant-replace', collectionId: 'policy-help',
			embeddingModel: demoEmbeddingModel, queryEmbedding: vector, limit: 5,
		})
		expect(results).toMatchObject([{ revision: 2, content: 'new text' }])
	})

	test('rolls back the document update when a replacement chunk is invalid', async () => {
		await repository.replaceRevision(replacement('rollback', 1, 'committed text'))
		await expect(repository.replaceRevision(replacement('rollback', 2, 'broken text', [1, 0])))
			.rejects.toThrow('Expected 4 finite embedding values')
		const results = await repository.search({
			tenantId: 'tenant-rollback', collectionId: 'policy-help',
			embeddingModel: demoEmbeddingModel, queryEmbedding: vector, limit: 5,
		})
		expect(results).toMatchObject([{ revision: 1, content: 'committed text' }])
	})

	test('withdraws a newer revision and removes it from retrieval', async () => {
		await repository.replaceRevision(replacement('withdraw', 1, 'active text'))
		await repository.withdrawRevision({
			tenantId: 'tenant-withdraw', collectionId: 'policy-help', documentId: 'card-help',
			revision: 2, embeddingModel: demoEmbeddingModel,
		})
		await expect(repository.search({
			tenantId: 'tenant-withdraw', collectionId: 'policy-help',
			embeddingModel: demoEmbeddingModel, queryEmbedding: vector, limit: 5,
		})).resolves.toEqual([])
	})

	test('filters tenant, collection, and embedding model in the query', async () => {
		await repository.replaceRevision(replacement('scope', 1, 'allowed text'))
		await repository.replaceRevision({
			...replacement('other-tenant', 1, 'other tenant text'),
			collectionId: 'policy-help',
		})
		await repository.replaceRevision({
			...replacement('scope', 1, 'other collection text'),
			collectionId: 'private-policy',
			documentId: 'private-card-help',
		})
		await repository.replaceRevision({
			...replacement('scope', 1, 'other model text'),
			documentId: 'other-model-card-help',
			embeddingModel: 'other-embedding-v1',
		})
		const results = await repository.search({
			tenantId: 'tenant-scope', collectionId: 'policy-help',
			embeddingModel: demoEmbeddingModel, queryEmbedding: vector, limit: 10,
		})
		expect(results.map(result => result.content)).toEqual(['allowed text'])
	})
})
