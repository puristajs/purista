import { randomUUID } from 'node:crypto'
import { Pool } from 'pg'
import { afterAll, describe, expect, test } from 'vitest'
import { StaleKnowledgeRevisionError } from '../service/knowledge/v1/KnowledgeResources.js'
import { PgKnowledgeRepository } from './PgKnowledgeRepository.js'

const databaseUrl =
	process.env.DATABASE_URL ?? 'postgres://example_bank:local-example-password@127.0.0.1:55432/example_bank'

const dimensions = 1_536
const model = 'text-embedding-3-small'
const testRun = randomUUID()
const tenantPrefix = `tenant-p4-030-${testRun}`
const repository = new PgKnowledgeRepository(databaseUrl, dimensions)
const inspectionPool = new Pool({ connectionString: databaseUrl, max: 2 })
const vector = (first: number, second = 0) => [first, second, ...Array.from({ length: dimensions - 2 }, () => 0)]

afterAll(async () => {
	const cleanupErrors: unknown[] = []
	try {
		await inspectionPool.query('DELETE FROM knowledge_documents WHERE tenant_id LIKE $1', [`${tenantPrefix}%`])
	} catch (error) {
		cleanupErrors.push(error)
	}
	try {
		await repository.destroy()
	} catch (error) {
		cleanupErrors.push(error)
	}
	try {
		await inspectionPool.end()
	} catch (error) {
		cleanupErrors.push(error)
	}
	if (cleanupErrors.length > 0) throw new AggregateError(cleanupErrors, 'Could not clean up PostgreSQL test resources')
})

function revision(scope: string, number: number, content: string, embedding = vector(1)) {
	return {
		tenantId: `${tenantPrefix}-${scope}`,
		collectionId: 'customer-help',
		documentId: 'transfer-help',
		revision: number,
		title: 'Transfer help',
		embeddingModel: model,
		chunks: [{ index: 0, content, embedding }],
	}
}

describe('PgKnowledgeRepository', () => {
	test('persists document metadata and ordered vector chunks', async () => {
		const input = {
			...revision('persistence', 1, 'Transfers can remain pending.'),
			title: 'International transfer timing',
			chunks: [
				{ index: 0, content: 'Transfers can remain pending.', embedding: vector(1) },
				{ index: 1, content: 'Review the transfer after two business days.', embedding: vector(0, 1) },
			],
		}
		await repository.replaceRevision(input)

		const document = await inspectionPool.query(
			`SELECT tenant_id, collection_id, document_id, revision, title, status, embedding_model
			 FROM knowledge_documents
			 WHERE tenant_id = $1 AND collection_id = $2 AND document_id = $3`,
			[input.tenantId, input.collectionId, input.documentId],
		)
		expect(document.rows).toEqual([
			{
				tenant_id: input.tenantId,
				collection_id: input.collectionId,
				document_id: input.documentId,
				revision: 1,
				title: 'International transfer timing',
				status: 'active',
				embedding_model: model,
			},
		])

		const chunks = await inspectionPool.query(
			`SELECT chunk_index, content, embedding_model,
			        vector_dims(embedding) AS dimensions, embedding::text AS embedding
			 FROM knowledge_chunks
			 WHERE tenant_id = $1 AND collection_id = $2 AND document_id = $3
			 ORDER BY chunk_index`,
			[input.tenantId, input.collectionId, input.documentId],
		)
		expect(chunks.rows).toEqual([
			{
				chunk_index: 0,
				content: 'Transfers can remain pending.',
				embedding_model: model,
				dimensions,
				embedding: `[${vector(1).join(',')}]`,
			},
			{
				chunk_index: 1,
				content: 'Review the transfer after two business days.',
				embedding_model: model,
				dimensions,
				embedding: `[${vector(0, 1).join(',')}]`,
			},
		])
	})

	test('atomically replaces only newer revisions and rejects equal or older writes', async () => {
		const first = revision('replacement', 1, 'Old policy')
		await repository.replaceRevision(first)
		await repository.replaceRevision(revision('replacement', 2, 'Current policy'))
		await expect(repository.replaceRevision(revision('replacement', 2, 'Duplicate policy'))).rejects.toBeInstanceOf(
			StaleKnowledgeRevisionError,
		)
		await expect(repository.replaceRevision(revision('replacement', 1, 'Stale policy'))).rejects.toBeInstanceOf(
			StaleKnowledgeRevisionError,
		)

		const stored = await inspectionPool.query(
			`SELECT revision, title FROM knowledge_documents
			 WHERE tenant_id = $1 AND collection_id = $2 AND document_id = $3`,
			[first.tenantId, first.collectionId, first.documentId],
		)
		expect(stored.rows).toEqual([{ revision: 2, title: 'Transfer help' }])
		await expect(
			repository.search({
				tenantId: first.tenantId,
				collectionId: first.collectionId,
				embeddingModel: model,
				queryEmbedding: vector(1),
				limit: 4,
			}),
		).resolves.toMatchObject([{ documentId: 'transfer-help', chunkIndex: 0, content: 'Current policy' }])
	})

	test('allows exactly one concurrent first writer for the same revision', async () => {
		const left = revision('concurrent', 1, 'Left policy')
		const right = revision('concurrent', 1, 'Right policy')
		const results = await Promise.allSettled([repository.replaceRevision(left), repository.replaceRevision(right)])

		expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
		const rejected = results.filter((result) => result.status === 'rejected')
		expect(rejected).toHaveLength(1)
		expect(rejected[0]).toMatchObject({ reason: expect.any(StaleKnowledgeRevisionError) })
		const stored = await inspectionPool.query(
			`SELECT d.revision, c.content
			 FROM knowledge_documents d
			 JOIN knowledge_chunks c
			   ON c.tenant_id = d.tenant_id
			  AND c.collection_id = d.collection_id
			  AND c.document_id = d.document_id
			  AND c.revision = d.revision
			 WHERE d.tenant_id = $1 AND d.collection_id = $2 AND d.document_id = $3`,
			[left.tenantId, left.collectionId, left.documentId],
		)
		expect(stored.rows).toHaveLength(1)
		expect(stored.rows[0]).toMatchObject({ revision: 1 })
		expect(['Left policy', 'Right policy']).toContain(stored.rows[0]?.content)
	})

	test('rolls back document and chunk replacement when a later vector is invalid', async () => {
		const original = {
			...revision('rollback', 1, 'Committed first chunk'),
			chunks: [
				{ index: 0, content: 'Committed first chunk', embedding: vector(1) },
				{ index: 1, content: 'Committed second chunk', embedding: vector(0, 1) },
			],
		}
		await repository.replaceRevision(original)
		await expect(
			repository.replaceRevision({
				...revision('rollback', 2, 'Replacement first chunk'),
				title: 'Broken replacement',
				chunks: [
					{ index: 0, content: 'Replacement first chunk', embedding: vector(1) },
					{ index: 1, content: 'Broken second chunk', embedding: [1, 0] },
				],
			}),
		).rejects.toThrow('Expected 1536 finite embedding values')

		const document = await inspectionPool.query(
			`SELECT revision, title FROM knowledge_documents
			 WHERE tenant_id = $1 AND collection_id = $2 AND document_id = $3`,
			[original.tenantId, original.collectionId, original.documentId],
		)
		expect(document.rows).toEqual([{ revision: 1, title: 'Transfer help' }])
		const chunks = await inspectionPool.query(
			`SELECT chunk_index, content FROM knowledge_chunks
			 WHERE tenant_id = $1 AND collection_id = $2 AND document_id = $3
			 ORDER BY chunk_index`,
			[original.tenantId, original.collectionId, original.documentId],
		)
		expect(chunks.rows).toEqual([
			{ chunk_index: 0, content: 'Committed first chunk' },
			{ chunk_index: 1, content: 'Committed second chunk' },
		])
	})

	test('rejects non-finite vectors without leaving a document row', async () => {
		const input = revision('non-finite', 1, 'Invalid vector', vector(Number.NaN))
		await expect(repository.replaceRevision(input)).rejects.toThrow('Expected 1536 finite embedding values')

		const stored = await inspectionPool.query(
			`SELECT count(*)::integer AS count FROM knowledge_documents
			 WHERE tenant_id = $1 AND collection_id = $2 AND document_id = $3`,
			[input.tenantId, input.collectionId, input.documentId],
		)
		expect(stored.rows).toEqual([{ count: 0 }])
	})

	test('rolls back a newer revision when cancellation arrives after chunk mutation starts', async () => {
		const original = revision('late-abort', 1, 'Committed before cancellation')
		await repository.replaceRevision(original)
		const controller = new AbortController()
		let abortTriggered = false
		// The repository reads this value only after it has inserted the first replacement chunk.
		const abortingChunk = {
			index: 1,
			content: 'This chunk must be rolled back',
			get embedding() {
				abortTriggered = true
				controller.abort()
				return vector(0, 1)
			},
		}

		await expect(
			repository.replaceRevision(
				{
					...revision('late-abort', 2, 'Replacement before cancellation'),
					title: 'Cancelled replacement',
					chunks: [
						{ index: 0, content: 'A mutation happens before cancellation', embedding: vector(1) },
						abortingChunk,
					],
				},
				controller.signal,
			),
		).rejects.toMatchObject({ name: 'AbortError' })
		expect(abortTriggered).toBe(true)

		const document = await inspectionPool.query(
			`SELECT revision, title FROM knowledge_documents
			 WHERE tenant_id = $1 AND collection_id = $2 AND document_id = $3`,
			[original.tenantId, original.collectionId, original.documentId],
		)
		expect(document.rows).toEqual([{ revision: 1, title: 'Transfer help' }])
		const chunks = await inspectionPool.query(
			`SELECT chunk_index, content FROM knowledge_chunks
			 WHERE tenant_id = $1 AND collection_id = $2 AND document_id = $3
			 ORDER BY chunk_index`,
			[original.tenantId, original.collectionId, original.documentId],
		)
		expect(chunks.rows).toEqual([{ chunk_index: 0, content: 'Committed before cancellation' }])
	})

	test('keeps retrieval inside the requested tenant and collection', async () => {
		const allowed = revision('scope', 1, 'Allowed policy')
		await repository.replaceRevision(allowed)
		await repository.replaceRevision({
			...revision('scope', 1, 'Private policy', vector(1, 0.1)),
			collectionId: 'private-help',
			documentId: 'private-transfer-help',
		})
		await repository.replaceRevision(revision('other', 1, 'Other tenant policy', vector(1, 0.1)))

		const matches = await repository.search({
			tenantId: allowed.tenantId,
			collectionId: allowed.collectionId,
			embeddingModel: model,
			queryEmbedding: vector(1),
			limit: 10,
		})
		expect(matches.map((match) => match.content)).toEqual(['Allowed policy'])
	})

	test('rejects aborted writes before borrowing a database connection', async () => {
		const controller = new AbortController()
		controller.abort()
		await expect(repository.replaceRevision(revision('aborted', 1, 'Never stored'), controller.signal)).rejects.toThrow(
			'This operation was aborted',
		)
	})
})
