import { defineAgent } from '@purista/harness'
import { z } from 'zod'

export const answerSupportQuestionInputSchema = z.strictObject({
	conversationId: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/),
	question: z.string().trim().min(1).max(2_000),
})

export const answerSupportQuestionOutputSchema = z.strictObject({
	answer: z.string().trim().min(1).max(2_000),
})

export const answerSupportQuestionAgent = defineAgent('answerSupportQuestion', {
	model: 'answering',
	input: answerSupportQuestionInputSchema,
	output: answerSupportQuestionOutputSchema,
	instructions: [
		'Answer one support question in plain language.',
		'Use earlier messages in this conversation when they are relevant.',
		'Do not claim that you performed an account action.',
	].join(' '),
	prompt: (input) => ({ role: 'user', content: `Conversation ${input.conversationId}: ${input.question}` }),
})
