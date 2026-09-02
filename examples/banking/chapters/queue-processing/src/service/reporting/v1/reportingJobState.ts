import { z } from 'zod'

export const reportingQueueJobStorePrefix = 'example-bank:reporting-job'
export const reportingJobStateKey = (jobId: string) => `${reportingQueueJobStorePrefix}:${jobId}`

export const reportingJobRecordSchema = z.object({
	jobId: z.string().min(1),
	queueName: z.literal('generateStatement'),
	status: z.enum(['success', 'failed', 'cancelled', 'dead-lettered', 'progress']),
	attempt: z.number().int().positive(),
	updatedAt: z.number().int().nonnegative(),
	tenantId: z.string().optional(),
	principalId: z.string().optional(),
	result: z.unknown().optional(),
	error: z.unknown().optional(),
})
