import type { z } from 'zod'

import type {
	reportingV1RequestStatementInputParameterSchema,
	reportingV1RequestStatementInputPayloadSchema,
	reportingV1RequestStatementOutputPayloadSchema,
}
from './schema.js'

export type ReportingV1RequestStatementInputParameter = z.input<typeof reportingV1RequestStatementInputParameterSchema>

export type ReportingV1RequestStatementInputPayload = z.input<typeof reportingV1RequestStatementInputPayloadSchema>

export type ReportingV1RequestStatementOutputPayload = z.output<typeof reportingV1RequestStatementOutputPayloadSchema>
