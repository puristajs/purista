export const demoEmbeddingModel = 'demo-embedding-v1'
export const demoEmbeddingDimensions = 4

export type EmbedTextsInput = {
	texts: string[]
	model: string
	signal: AbortSignal
}

export interface KnowledgeEmbeddingProvider {
	embed(input: EmbedTextsInput): Promise<number[][]>
}

export type KnowledgeChunkInput = {
	index: number
	content: string
	embedding: number[]
}

export type ReplaceKnowledgeRevisionInput = {
	tenantId: string
	collectionId: string
	documentId: string
	revision: number
	title: string
	embeddingModel: string
	chunks: KnowledgeChunkInput[]
}

export type WithdrawKnowledgeRevisionInput = Omit<
	ReplaceKnowledgeRevisionInput,
	'title' | 'chunks'
>

export type SearchKnowledgeInput = {
	tenantId: string
	collectionId: string
	embeddingModel: string
	queryEmbedding: number[]
	limit: number
}

export type KnowledgeSearchResult = {
	documentId: string
	revision: number
	chunkIndex: number
	content: string
	score: number
}

export interface KnowledgeRepository {
	replaceRevision(input: ReplaceKnowledgeRevisionInput, signal?: AbortSignal): Promise<void>
	withdrawRevision(input: WithdrawKnowledgeRevisionInput, signal?: AbortSignal): Promise<void>
	search(input: SearchKnowledgeInput, signal?: AbortSignal): Promise<KnowledgeSearchResult[]>
}

export class StaleKnowledgeRevisionError extends Error {
	constructor() {
		super('Knowledge revision is not newer than the stored revision')
		this.name = 'StaleKnowledgeRevisionError'
	}
}
