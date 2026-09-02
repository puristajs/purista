import { z } from 'zod'

export const reportingV1GenerateSnapshotQueuePayloadSchema = z.strictObject({
	transactionId: z.uuid(),
})

export const reportingV1GenerateSnapshotQueueParameterSchema = z.object({})
