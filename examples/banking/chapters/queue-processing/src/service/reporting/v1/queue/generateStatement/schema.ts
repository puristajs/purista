import { z } from 'zod'

export const reportingV1GenerateStatementQueuePayloadSchema = z.strictObject({
	accountId: z.string().trim().min(1),
	transactionId: z.uuid(),
})

export const reportingV1GenerateStatementQueueParameterSchema = z.object({})
