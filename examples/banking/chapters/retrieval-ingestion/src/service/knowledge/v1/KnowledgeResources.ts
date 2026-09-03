import type { KnowledgeMatch } from './schema.js'

export type KnowledgeChunkInput = {
	index: number
	content: string
	embedding: number[]
}

export interface KnowledgeRepository {
	replaceRevision(
		input: Readonly<{
			tenantId: string
			collectionId: string
			documentId: string
			revision: number
			title: string
			embeddingModel: string
			chunks: KnowledgeChunkInput[]
		}>,
		signal?: AbortSignal,
	): Promise<void>
	search(
		input: Readonly<{
			tenantId: string
			collectionId: string
			embeddingModel: string
			queryEmbedding: number[]
			limit: number
			signal?: AbortSignal
		}>,
	): Promise<KnowledgeMatch[]>
}

export interface KnowledgeCollectionPolicy {
	canAccess(
		input: Readonly<{
			tenantId: string
			principalId: string
			collectionId: string
			action: 'edit' | 'search'
		}>,
	): Promise<boolean>
}

export class StaleKnowledgeRevisionError extends Error {
	constructor() {
		super('Knowledge revision is not newer than the stored revision')
		this.name = 'StaleKnowledgeRevisionError'
	}
}
