import type { KnowledgeMatch } from './schema.js'

export const demoEmbeddingModel = 'demo-embedding-v1'
export const demoEmbeddingDimensions = 4

export interface KnowledgeEmbeddingProvider {
	readonly model: string
	readonly dimensions: number
	embedQuery(input: Readonly<{ text: string; signal?: AbortSignal }>): Promise<number[]>
}

export interface KnowledgeRepository {
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
	canSearch(
		input: Readonly<{
			tenantId: string
			principalId: string
			collectionId: string
		}>,
	): Promise<boolean>
}
