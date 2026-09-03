import { type BuilderState, defineHarnessModule, type ModelAlias } from '@purista/harness'
import { z } from 'zod'

export const answerSupportQuestionInputSchema = z.strictObject({
	conversationId: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/),
	question: z.string().trim().min(1).max(2_000),
})

export const answerSupportQuestionOutputSchema = z.strictObject({
	answer: z.string().trim().min(1).max(2_000),
})

type PrimaryModelState = BuilderState & { models: { primary: ModelAlias } }

export const answerSupportQuestionAgent = defineHarnessModule<PrimaryModelState>()(
	'support.agent.answer-support-question',
	{
		version: '1.0.0',
		register(builder) {
			return builder.agent('answer_support_question', {
				model: 'primary',
				input: answerSupportQuestionInputSchema,
				output: answerSupportQuestionOutputSchema,
				updates: 'object-snapshot',
				instructions: [
					'Answer one Example Bank support question in plain language.',
					'Use earlier messages in this conversation when they are relevant.',
					'Do not claim that you performed an account action.',
				].join(' '),
			})
		},
	},
)
