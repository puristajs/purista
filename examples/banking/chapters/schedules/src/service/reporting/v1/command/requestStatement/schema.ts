import { z } from 'zod'

export const reportingV1RequestStatementInputParameterSchema = z.object({})
export const reportingV1RequestStatementInputPayloadSchema = z.strictObject({
	accountId: z.string().trim().min(1),
	transactionId: z.uuid(),
})
export const reportingV1RequestStatementOutputPayloadSchema = z.strictObject({
	jobId: z.string().min(1),
	queueName: z.string().min(1),
	scheduledAt: z.number().int().nonnegative().optional(),
})
