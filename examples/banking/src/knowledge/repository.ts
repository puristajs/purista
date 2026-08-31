import { createHash } from 'node:crypto'

import { HandledError, StatusCode } from '@purista/core'

export const knowledgeCollectionIds = ['account-a-documents', 'account-c-documents'] as const
export type KnowledgeCollectionId = (typeof knowledgeCollectionIds)[number]

export type KnowledgeDocumentInput = {
	collectionId: KnowledgeCollectionId
	documentId: string
	title: string
	text: string
	revision: number
}

export type KnowledgeChunk = {
	chunkId: string
	text: string
	vector: number[]
}

export type KnowledgeDocument = Omit<KnowledgeDocumentInput, 'text'> & {
	tenantId: 'tenant-north'
	accountId: 'account-a' | 'account-c'
	checksum: string
	chunks: KnowledgeChunk[]
}

export type IngestionFailure = {
	collectionId: KnowledgeCollectionId
	documentId: string
	revision: number
	reason: string
}

const collections: Record<
	KnowledgeCollectionId,
	{
		tenantId: 'tenant-north'
		accountId: KnowledgeDocument['accountId']
		readers: readonly string[]
	}
> = {
	'account-a-documents': { tenantId: 'tenant-north', accountId: 'account-a', readers: ['alice', 'bob'] },
	'account-c-documents': { tenantId: 'tenant-north', accountId: 'account-c', readers: ['carol'] },
}

const tokenize = (text: string) =>
	text
		.toLocaleLowerCase('en')
		.split(/[^a-z0-9]+/)
		.filter(token => token.length > 0)

/**
 * Creates a small deterministic vector for this tutorial. It is deliberately
 * not a semantic model or an embedding provider; the attached agent owns when
 * this function is invoked and the repository owns what is persisted.
 */
export const createDeterministicEmbedding = (text: string) => {
	const vector = [0, 0, 0, 0, 0, 0, 0, 0]
	for (const token of tokenize(text)) {
		const digest = createHash('sha256').update(token).digest()
		vector[digest[0] % vector.length] += 1
	}
	const length = Math.hypot(...vector)
	return length === 0 ? vector : vector.map(value => Number((value / length).toFixed(6)))
}

const similarity = (left: readonly number[], right: readonly number[]) =>
	Number(left.reduce((total, value, index) => total + value * (right[index] ?? 0), 0).toFixed(6))

const splitIntoChunks = (text: string) => {
	const sentences = text
		.split(/(?<=[.!?])\s+/)
		.map(sentence => sentence.trim())
		.filter(Boolean)
	return (sentences.length > 0 ? sentences : [text.trim()]).map((chunk, index) => ({
		chunkId: `chunk-${index + 1}`,
		text: chunk,
		vector: createDeterministicEmbedding(chunk),
	}))
}

/**
 * In-memory collection and search store for the tutorial. Its collection
 * policy is the P6 business boundary: users may only operate on the account
 * collection that their documented mandate permits.
 */
export class BankingKnowledgeRepository {
	private readonly documents = new Map<string, KnowledgeDocument>()
	private readonly embeddingRequests: Array<Pick<KnowledgeDocumentInput, 'collectionId' | 'documentId' | 'revision'>> =
		[]
	private readonly failures: IngestionFailure[] = []

	canAccessCollection(input: {
		tenantId: string | undefined
		principalId: string | undefined
		collectionId: KnowledgeCollectionId
	}) {
		const collection = collections[input.collectionId]
		return (
			input.tenantId === collection.tenantId &&
			Boolean(input.principalId && collection.readers.includes(input.principalId))
		)
	}

	getCollectionAccount(collectionId: KnowledgeCollectionId) {
		return collections[collectionId].accountId
	}

	getDocument(collectionId: KnowledgeCollectionId, documentId: string) {
		return this.documents.get(this.documentKey(collectionId, documentId))
	}

	listDocuments(collectionId: KnowledgeCollectionId) {
		return [...this.documents.values()].filter(document => document.collectionId === collectionId)
	}

	listEmbeddingRequests() {
		return [...this.embeddingRequests]
	}

	listFailures() {
		return [...this.failures]
	}

	/** Stores one immutable revision result, or returns the existing matching revision for a duplicate delivery. */
	storeEmbeddedDocument(input: KnowledgeDocumentInput) {
		this.embeddingRequests.push({
			collectionId: input.collectionId,
			documentId: input.documentId,
			revision: input.revision,
		})
		if (input.text.includes('[[force-embedding-failure]]')) {
			throw new Error('The tutorial embedding worker was instructed to fail')
		}

		const key = this.documentKey(input.collectionId, input.documentId)
		const checksum = createHash('sha256').update(input.text).digest('hex')
		const existing = this.documents.get(key)
		if (existing) {
			if (input.revision < existing.revision) {
				throw new HandledError(StatusCode.Conflict, 'Document revision is older than the stored revision')
			}
			if (input.revision === existing.revision) {
				if (existing.checksum === checksum && existing.title === input.title)
					return { document: existing, outcome: 'unchanged' as const }
				throw new HandledError(StatusCode.Conflict, 'A document revision may not change its content')
			}
		}

		const document: KnowledgeDocument = {
			collectionId: input.collectionId,
			documentId: input.documentId,
			title: input.title,
			revision: input.revision,
			tenantId: 'tenant-north',
			accountId: this.getCollectionAccount(input.collectionId),
			checksum,
			chunks: splitIntoChunks(input.text),
		}
		this.documents.set(key, document)
		return { document, outcome: existing ? ('updated' as const) : ('created' as const) }
	}

	recordFailure(failure: IngestionFailure) {
		if (
			!this.failures.some(
				entry =>
					entry.collectionId === failure.collectionId &&
					entry.documentId === failure.documentId &&
					entry.revision === failure.revision,
			)
		) {
			this.failures.push(failure)
		}
	}

	deleteDocument(collectionId: KnowledgeCollectionId, documentId: string) {
		return this.documents.delete(this.documentKey(collectionId, documentId))
	}

	search(collectionId: KnowledgeCollectionId, query: string) {
		const queryVector = createDeterministicEmbedding(query)
		return this.listDocuments(collectionId)
			.flatMap(document =>
				document.chunks.map(chunk => ({
					documentId: document.documentId,
					title: document.title,
					revision: document.revision,
					chunkId: chunk.chunkId,
					excerpt: chunk.text,
					score: similarity(queryVector, chunk.vector),
				})),
			)
			.filter(result => result.score > 0)
			.sort((left, right) => right.score - left.score || left.documentId.localeCompare(right.documentId))
	}

	private documentKey(collectionId: KnowledgeCollectionId, documentId: string) {
		return `${collectionId}:${documentId}`
	}
}
