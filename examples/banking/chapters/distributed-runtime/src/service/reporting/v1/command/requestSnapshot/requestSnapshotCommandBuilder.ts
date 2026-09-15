import {
	reportingV1GenerateSnapshotQueueParameterSchema,
	reportingV1GenerateSnapshotQueuePayloadSchema,
} from '../../queue/generateSnapshot/schema.js'
import { reportingV1ServiceBuilder } from '../../reportingV1ServiceBuilder.js'
import {
	reportingV1RequestSnapshotInputParameterSchema,
	reportingV1RequestSnapshotInputPayloadSchema,
	reportingV1RequestSnapshotOutputPayloadSchema,
} from './schema.js'

export const requestSnapshotCommandBuilder = reportingV1ServiceBuilder
	.getCommandBuilder('requestSnapshot', 'Request one transaction snapshot')
	.addPayloadSchema(reportingV1RequestSnapshotInputPayloadSchema)
	.addParameterSchema(reportingV1RequestSnapshotInputParameterSchema)
	.addOutputSchema(reportingV1RequestSnapshotOutputPayloadSchema)
	.canEnqueue(
		'generateSnapshot',
		reportingV1GenerateSnapshotQueuePayloadSchema,
		reportingV1GenerateSnapshotQueueParameterSchema,
	)
	.setCommandFunction(async function (context, payload) {
		return context.queue.enqueue.generateSnapshot(payload, {}, {
			idempotencyKey: `snapshot-${payload.transactionId}`,
		})
	})
