import type { z } from 'zod'

import type {
	reportingV1GetStatementStatusInputParameterSchema,
	reportingV1GetStatementStatusInputPayloadSchema,
	reportingV1GetStatementStatusOutputPayloadSchema,
}
from './schema.js'

export type ReportingV1GetStatementStatusInputParameter = z.input<typeof reportingV1GetStatementStatusInputParameterSchema>

export type ReportingV1GetStatementStatusInputPayload = z.input<typeof reportingV1GetStatementStatusInputPayloadSchema>

export type ReportingV1GetStatementStatusOutputPayload = z.output<typeof reportingV1GetStatementStatusOutputPayloadSchema>
