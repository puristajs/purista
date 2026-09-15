import { z } from 'zod'

export const answerProcedureQuestionInputSchema = z.strictObject({
	caseId: z.string().min(1).max(80),
	question: z.string().trim().min(1).max(2_000),
})

export const answerProcedureQuestionOutputSchema = z.strictObject({
	answer: z.string().trim().min(1).max(2_000),
	method: z.enum(['pending_transfer', 'card_replacement', 'other']),
})
