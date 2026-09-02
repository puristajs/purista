import type { z } from 'zod'

import type {
	reportingV1GenerateStatementQueueParameterSchema,
	reportingV1GenerateStatementQueuePayloadSchema,
}
 from './schema.js'

export type ReportingV1GenerateStatementQueueParameter = z.input<typeof reportingV1GenerateStatementQueueParameterSchema>

export type ReportingV1GenerateStatementQueuePayload = z.input<typeof reportingV1GenerateStatementQueuePayloadSchema>
