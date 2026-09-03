import { Pool, type PoolClient } from 'pg'
import {
	demoEmbeddingDimensions,
	StaleKnowledgeRevisionError,
	type KnowledgeRepository,
	type KnowledgeSearchResult,
	type ReplaceKnowledgeRevisionInput,
	type SearchKnowledgeInput,
	type WithdrawKnowledgeRevisionInput,
} from '../service/knowledge/v1/KnowledgeResources.js'

function vectorLiteral(vector: number[]) {
	if (vector.length !== demoEmbeddingDimensions || !vector.every(Number.isFinite)) {
		throw new Error(`Expected ${demoEmbeddingDimensions} finite embedding values`)
	}
	return `[${vector.join(',')}]`
}

async function currentRevision(
	client: PoolClient,
	input: { tenantId: string; collectionId: string; documentId: string },
) {
	const result = await client.query(
		`SELECT revision
		 FROM knowledge_documents
		 WHERE tenant_id = $1 AND collection_id = $2 AND document_id = $3
		 FOR UPDATE`,
		[input.tenantId, input.collectionId, input.documentId],
	)
	return (result.rows[0] as { revision: number } | undefined)?.revision
}

function assertNewer(storedRevision: number | undefined, requestedRevision: number) {
	if (storedRevision !== undefined && requestedRevision <= storedRevision) {
		throw new StaleKnowledgeRevisionError()
	}
}

export class PgKnowledgeRepository implements KnowledgeRepository {
	readonly name = 'pgKnowledgeRepository'
	private readonly pool: Pool

	constructor(connectionString: string) {
		this.pool = new Pool({ connectionString, max: 4 })
	}

	async replaceRevision(input: ReplaceKnowledgeRevisionInput, signal?: AbortSignal) {
		signal?.throwIfAborted()
		const client = await this.pool.connect()
		try {
			await client.query('BEGIN')
			assertNewer(await currentRevision(client, input), input.revision)
			await client.query(
				`INSERT INTO knowledge_documents (
				   tenant_id, collection_id, document_id, revision, title, status, embedding_model
				 ) VALUES ($1, $2, $3, $4, $5, 'active', $6)
				 ON CONFLICT (tenant_id, collection_id, document_id) DO UPDATE SET
				   revision = EXCLUDED.revision,
				   title = EXCLUDED.title,
				   status = 'active',
				   embedding_model = EXCLUDED.embedding_model,
				   updated_at = now()`,
				[
					input.tenantId,
					input.collectionId,
					input.documentId,
					input.revision,
					input.title,
					input.embeddingModel,
				],
			)
			await client.query(
				`DELETE FROM knowledge_chunks
				 WHERE tenant_id = $1 AND collection_id = $2 AND document_id = $3`,
				[input.tenantId, input.collectionId, input.documentId],
			)
			for (const chunk of input.chunks) {
				signal?.throwIfAborted()
				await client.query(
					`INSERT INTO knowledge_chunks (
					   tenant_id, collection_id, document_id, revision,
					   chunk_index, content, embedding_model, embedding
					 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector)`,
					[
						input.tenantId,
						input.collectionId,
						input.documentId,
						input.revision,
						chunk.index,
						chunk.content,
						input.embeddingModel,
						vectorLiteral(chunk.embedding),
					],
				)
			}
			await client.query('COMMIT')
		} catch (error) {
			await client.query('ROLLBACK')
			throw error
		} finally {
			client.release()
		}
	}

	async withdrawRevision(input: WithdrawKnowledgeRevisionInput, signal?: AbortSignal) {
		signal?.throwIfAborted()
		const client = await this.pool.connect()
		try {
			await client.query('BEGIN')
			assertNewer(await currentRevision(client, input), input.revision)
			await client.query(
				`INSERT INTO knowledge_documents (
				   tenant_id, collection_id, document_id, revision, title, status, embedding_model
				 ) VALUES ($1, $2, $3, $4, '', 'withdrawn', $5)
				 ON CONFLICT (tenant_id, collection_id, document_id) DO UPDATE SET
				   revision = EXCLUDED.revision,
				   status = 'withdrawn',
				   embedding_model = EXCLUDED.embedding_model,
				   updated_at = now()`,
				[
					input.tenantId,
					input.collectionId,
					input.documentId,
					input.revision,
					input.embeddingModel,
				],
			)
			await client.query(
				`DELETE FROM knowledge_chunks
				 WHERE tenant_id = $1 AND collection_id = $2 AND document_id = $3`,
				[input.tenantId, input.collectionId, input.documentId],
			)
			await client.query('COMMIT')
		} catch (error) {
			await client.query('ROLLBACK')
			throw error
		} finally {
			client.release()
		}
	}

	async search(input: SearchKnowledgeInput, signal?: AbortSignal): Promise<KnowledgeSearchResult[]> {
		signal?.throwIfAborted()
		const result = await this.pool.query(
			`SELECT c.document_id, c.revision, c.chunk_index, c.content,
			        1 - (c.embedding <=> $4::vector) AS score
			 FROM knowledge_chunks c
			 JOIN knowledge_documents d
			   ON d.tenant_id = c.tenant_id
			  AND d.collection_id = c.collection_id
			  AND d.document_id = c.document_id
			  AND d.revision = c.revision
			 WHERE c.tenant_id = $1
			   AND c.collection_id = $2
			   AND c.embedding_model = $3
			   AND d.status = 'active'
			 ORDER BY c.embedding <=> $4::vector, c.document_id, c.chunk_index
			 LIMIT $5`,
			[
				input.tenantId,
				input.collectionId,
				input.embeddingModel,
				vectorLiteral(input.queryEmbedding),
				input.limit,
			],
		)
		return result.rows.map(row => ({
			documentId: String(row.document_id),
			revision: Number(row.revision),
			chunkIndex: Number(row.chunk_index),
			content: String(row.content),
			score: Number(row.score),
		}))
	}

	async destroy() {
		await this.pool.end()
	}
}
