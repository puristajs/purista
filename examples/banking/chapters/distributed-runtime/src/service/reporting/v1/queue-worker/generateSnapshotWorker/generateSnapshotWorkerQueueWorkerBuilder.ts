import { reportingV1ServiceBuilder } from '../../reportingV1ServiceBuilder.js'
import { reportingV1GenerateSnapshotQueuePayloadSchema } from '../../queue/generateSnapshot/schema.js'

export const generateSnapshotWorkerQueueWorkerBuilder = reportingV1ServiceBuilder
	.getQueueWorkerBuilder('generateSnapshot', 'Build one transaction snapshot')
	.setMode('continuous')
	.setMaxParallelHandlers(1)
	.setHandler(async function (_context, message) {
		const payload = reportingV1GenerateSnapshotQueuePayloadSchema.parse(message.payload)
		return {
			status: 'success' as const,
			output: {
				transactionId: payload.transactionId,
				result: 'snapshot-ready' as const,
				generatedAt: new Date().toISOString(),
			},
		}
	})
