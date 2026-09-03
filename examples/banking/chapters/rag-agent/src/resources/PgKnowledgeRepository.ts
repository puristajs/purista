import { Pool } from 'pg'
import { demoEmbeddingDimensions, type KnowledgeRepository } from '../service/knowledge/v1/KnowledgeResources.js'

function vectorLiteral(vector: number[]) {
	if (vector.length !== demoEmbeddingDimensions || !vector.every(Number.isFinite)) {
		throw new Error(`Expected ${demoEmbeddingDimensions} finite embedding values`)
	}
	return `[${vector.join(',')}]`
}

export class PgKnowledgeRepository implements KnowledgeRepository {
	public readonly name = 'pgKnowledgeRepository'
	private readonly pool: Pool

	public constructor(connectionString: string) {
		this.pool = new Pool({ connectionString, max: 4 })
	}

	public async search(input: Parameters<KnowledgeRepository['search']>[0]) {
		input.signal?.throwIfAborted()
		const result = await this.pool.query(
			`SELECT c.document_id, c.chunk_index, c.content,
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
			[input.tenantId, input.collectionId, input.embeddingModel, vectorLiteral(input.queryEmbedding), input.limit],
		)
		return result.rows.map((row) => ({
			documentId: String(row.document_id),
			chunkIndex: Number(row.chunk_index),
			content: String(row.content),
			score: Number(row.score),
		}))
	}

	public async destroy() {
		await this.pool.end()
	}
}
