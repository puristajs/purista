import { z } from 'zod'
import { generatedStatementSchema } from '../../statement.js'

export const reportingV1GetStatementStatusInputPayloadSchema = z.undefined()
export const reportingV1GetStatementStatusInputParameterSchema = z.object({ jobId: z.string().min(1) })
export const reportingV1GetStatementStatusOutputPayloadSchema = z.strictObject({
	jobId: z.string().min(1),
	status: z.enum(['success', 'failed', 'cancelled', 'dead-lettered', 'progress']),
	statement: generatedStatementSchema.optional(),
})
