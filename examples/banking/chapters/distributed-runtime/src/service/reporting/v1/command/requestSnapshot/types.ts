import type { z } from 'zod'

import type {
	reportingV1RequestSnapshotInputParameterSchema,
	reportingV1RequestSnapshotInputPayloadSchema,
	reportingV1RequestSnapshotOutputPayloadSchema,
}
from './schema.js'

export type ReportingV1RequestSnapshotInputParameter = z.input<typeof reportingV1RequestSnapshotInputParameterSchema>

export type ReportingV1RequestSnapshotInputPayload = z.input<typeof reportingV1RequestSnapshotInputPayloadSchema>

export type ReportingV1RequestSnapshotOutputPayload = z.output<typeof reportingV1RequestSnapshotOutputPayloadSchema>
