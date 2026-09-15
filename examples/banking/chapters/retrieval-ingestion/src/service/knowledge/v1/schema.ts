import { decisionEvidenceSchema } from '@purista/harness'
import { z } from 'zod'

export const ingestKnowledgeInputSchema = z.object({
	collectionId: z.string().min(1).max(64),
	documentId: z.string().min(1).max(80),
	revision: z.number().int().positive(),
	title: z.string().min(1).max(120),
	content: z.string().min(1).max(20_000),
})

export const ingestKnowledgeOutputSchema = z.object({
	documentId: z.string().min(1),
	revision: z.number().int().positive(),
	chunkCount: z.number().int().positive(),
	embeddingModel: z.string().min(1),
})

export const storedKnowledgeChunksInputSchema = z.object({
	collectionId: z.string().min(1).max(64),
	documentId: z.string().min(1).max(80),
	revision: z.number().int().positive(),
	title: z.string().min(1).max(120),
	chunks: z
		.array(
			z.object({
				index: z.number().int().nonnegative(),
				content: z.string().min(1),
				embedding: z.array(z.number().finite()).min(1),
			}),
		)
		.min(1),
})

export const storedKnowledgeChunksOutputSchema = ingestKnowledgeOutputSchema

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

export const retrieveKnowledgeInputSchema = searchKnowledgeInputSchema

export const queryKnowledgeRepositoryInputSchema = retrieveKnowledgeInputSchema.extend({
	embedding: z.array(z.number().finite()).min(1),
})

export const retrieveKnowledgeOutputSchema = searchKnowledgeOutputSchema

export const answerKnowledgeQuestionInputSchema = z.object({
	collectionId: z.string().min(1),
	question: z.string().min(1).max(2_000),
})

export const runAnswerKnowledgeQuestionInputSchema = answerKnowledgeQuestionInputSchema.extend({
	conversationId: z.string().min(1).max(120).default('default'),
	resume: z
		.object({
			type: z.literal('tool-approval'),
			runId: z.string().min(1),
			interruptId: z.string().min(1),
			revision: z.string().min(1),
			eventId: z.string().min(1),
			decisions: z
				.array(z.object({ approvalId: z.string().min(1), approved: z.boolean(), reason: z.string().optional() }))
				.readonly(),
		})
		.optional(),
})

const toolApprovalRequestSchema = z.object({
	approvalId: z.string().min(1),
	runId: z.string().min(1),
	agentRunId: z.string().min(1),
	parentRunId: z.string().min(1).optional(),
	parentInvocationId: z.string().min(1).optional(),
	agentId: z.string().min(1),
	workflowId: z.string().min(1).optional(),
	invocationId: z.string().min(1),
	step: z.number().int().nonnegative(),
	toolId: z.string().min(1),
	callId: z.string().min(1),
	input: z.json(),
	demands: z.array(decisionEvidenceSchema).readonly(),
})
const toolApprovalInterruptSchema = z.object({
	type: z.literal('tool-approval'),
	id: z.string().min(1),
	revision: z.string().min(1),
	requests: z.array(toolApprovalRequestSchema).min(1).readonly(),
})
const answerRunOutcomeSchema = z.union([
	z.object({ status: z.literal('completed'), runId: z.string().min(1), output: z.string() }).readonly(),
	z
		.object({ status: z.literal('interrupted'), runId: z.string().min(1), interrupt: toolApprovalInterruptSchema })
		.readonly(),
])
export const runAnswerKnowledgeQuestionOutputSchema = z
	.object({
		sessionId: z.string().min(1),
		outcome: answerRunOutcomeSchema,
	})
	.readonly()

export type SearchKnowledgeInput = z.input<typeof searchKnowledgeInputSchema>
export type KnowledgeMatch = z.output<typeof knowledgeMatchSchema>
