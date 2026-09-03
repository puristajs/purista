import { z } from 'zod'

export const knowledgeMatchSchema = z.object({
	documentId: z.string().min(1),
	chunkIndex: z.number().int().nonnegative(),
	content: z.string().min(1),
	score: z.number().min(0).max(1),
})

export const searchKnowledgeInputSchema = z.object({
	collectionId: z.string().min(1),
	query: z.string().min(1).max(2_000),
	limit: z.number().int().min(1).max(8).default(4),
})

export const searchKnowledgeOutputSchema = z.object({
	matches: z.array(knowledgeMatchSchema).max(8),
})

export const answerKnowledgeQuestionInputSchema = z.object({
	collectionId: z.string().min(1),
	question: z.string().min(1).max(2_000),
})

export const retrievedEvidenceSchema = z.object({
	question: z.string().min(1),
	evidence: z.array(knowledgeMatchSchema).min(1).max(8),
})

export const aiSdkTextPartSchema = z
	.object({
		type: z.literal('text'),
		text: z.string(),
	})
	.passthrough()

export const aiSdkMessageSchema = z
	.object({
		id: z.string().min(1).optional(),
		role: z.enum(['system', 'user', 'assistant']),
		parts: z.array(z.unknown()),
	})
	.passthrough()

export const answerKnowledgeQuestionHttpInputSchema = z.object({
	id: z.string().min(1),
	messages: z.array(aiSdkMessageSchema).min(1),
	collectionId: z.string().min(1).default('customer-help'),
})

export const aiSdkUiMessageSseEventSchema = z.object({
	event: z.literal('data'),
	data: z.unknown(),
})

export const answerKnowledgeQuestionFinalSchema = z.object({
	status: z.literal('completed'),
})

export type SearchKnowledgeInput = z.input<typeof searchKnowledgeInputSchema>
export type KnowledgeMatch = z.output<typeof knowledgeMatchSchema>
