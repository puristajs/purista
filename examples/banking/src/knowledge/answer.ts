import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'

import { type BankingKnowledgeRepository, type KnowledgeCollectionId, knowledgeCollectionIds } from './repository.js'

export const knowledgeQuestionSchema = z.object({
	collectionId: z.enum(knowledgeCollectionIds),
	question: z.string().min(1).max(500),
})

export const groundedAnswerSchema = z.object({
	answer: z.string(),
	sources: z.array(
		z.object({
			documentId: z.string(),
			title: z.string(),
			revision: z.number().int().positive(),
			chunkId: z.string(),
			excerpt: z.string(),
		}),
	),
})

type KnowledgeIdentity = { tenantId: string | undefined; principalId: string | undefined }

/**
 * Builds a deterministic answer from authorized retrieval results.
 *
 * A later chapter may replace the presentation sentence with a model, but the
 * collection check and the selected source excerpts must remain server-owned.
 */
export const answerGroundedQuestion = (
	repository: BankingKnowledgeRepository,
	input: z.infer<typeof knowledgeQuestionSchema>,
	identity: KnowledgeIdentity,
) => {
	if (!repository.canAccessCollection({ ...identity, collectionId: input.collectionId })) {
		throw new HandledError(StatusCode.Forbidden, 'You may not ask questions about this banking document collection')
	}

	const sources = repository.search(input.collectionId, input.question).slice(0, 2)
	if (sources.length === 0) {
		return {
			answer:
				'I could not find an authorized document passage for that question. Ingest an account guide first, then ask again.',
			sources: [],
		}
	}

	return {
		answer: `Grounded answer: ${sources.map(source => source.excerpt).join(' ')}`,
		sources: sources.map(({ documentId, title, revision, chunkId, excerpt }) => ({
			documentId,
			title,
			revision,
			chunkId,
			excerpt,
		})),
	}
}

export type GroundedAnswer = z.infer<typeof groundedAnswerSchema>
export type GroundedQuestion = z.infer<typeof knowledgeQuestionSchema>
export type { KnowledgeCollectionId }
