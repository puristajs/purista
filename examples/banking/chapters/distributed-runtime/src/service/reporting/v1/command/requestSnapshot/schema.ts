import { z } from 'zod'

export const reportingV1RequestSnapshotInputParameterSchema = z.object({})
export const reportingV1RequestSnapshotInputPayloadSchema = z.strictObject({
	transactionId: z.uuid(),
})
export const reportingV1RequestSnapshotOutputPayloadSchema = z.strictObject({
	jobId: z.string().min(1),
	queueName: z.string().min(1),
	scheduledAt: z.number().int().nonnegative().optional(),
})
