import { z } from 'zod'

export const answerTransactionQuestionInputSchema = z.strictObject({
	questionId: z.string().min(1),
	accountId: z.string().min(1),
	transactionId: z.string().min(1),
	question: z.string().min(1),
})
export const answerTransactionQuestionOutputSchema = z.strictObject({
	answer: z.string(),
	transactionIds: z.array(z.string()),
})
