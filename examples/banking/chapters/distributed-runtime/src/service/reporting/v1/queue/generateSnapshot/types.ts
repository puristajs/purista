import type { z } from 'zod'

import type {
	reportingV1GenerateSnapshotQueueParameterSchema,
	reportingV1GenerateSnapshotQueuePayloadSchema,
}
 from './schema.js'

export type ReportingV1GenerateSnapshotQueueParameter = z.input<typeof reportingV1GenerateSnapshotQueueParameterSchema>

export type ReportingV1GenerateSnapshotQueuePayload = z.input<typeof reportingV1GenerateSnapshotQueuePayloadSchema>
