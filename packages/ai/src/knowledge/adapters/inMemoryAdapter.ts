/**
 * Minimal document structure understood by knowledge adapters.
 */
export type KnowledgeDocument = {
	id: string
	content: string
	metadata?: Record<string, unknown>
}

export interface KnowledgeAdapter {
	id: string
	upsert(document: KnowledgeDocument): Promise<void>
	query(query: string, limit?: number): Promise<KnowledgeDocument[]>
	delete(id: string): Promise<void>
}

/**
 * Reference knowledge adapter that keeps documents in memory.
 * Useful for tests and local development.
 */
export class InMemoryKnowledgeAdapter implements KnowledgeAdapter {
	readonly id = 'in-memory-knowledge'
	private readonly documents = new Map<string, KnowledgeDocument>()

	async upsert(document: KnowledgeDocument) {
		this.documents.set(document.id, document)
	}

	async query(query: string, limit = 5) {
		const results = Array.from(this.documents.values()).filter(doc =>
			doc.content.toLowerCase().includes(query.toLowerCase()),
		)
		return results.slice(0, limit)
	}

	async delete(id: string) {
		this.documents.delete(id)
	}
}
