import { reportingV1ServiceBuilder } from '../../reportingV1ServiceBuilder.js'
import {
	reportingV1GenerateSnapshotQueueParameterSchema,
	reportingV1GenerateSnapshotQueuePayloadSchema,
} from './schema.js'

export const generateSnapshotQueueBuilder = reportingV1ServiceBuilder
	.getQueueBuilder('generateSnapshot', 'Generate one transaction snapshot')
	.addPayloadSchema(reportingV1GenerateSnapshotQueuePayloadSchema)
	.addParameterSchema(reportingV1GenerateSnapshotQueueParameterSchema)
	.setLifecycleConfig({ maxAttempts: 3 })
	.setQueueBridgeConfig({ orderingGuarantee: 'fifo', prefetch: 1 })
	.setResultPolicy({ mode: 'state', delivery: 'required', ttlMs: 15 * 60 * 1000 })
