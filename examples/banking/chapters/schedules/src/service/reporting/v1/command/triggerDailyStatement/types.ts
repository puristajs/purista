import type { z } from 'zod'

import type {
	reportingV1TriggerDailyStatementInputParameterSchema,
	reportingV1TriggerDailyStatementInputPayloadSchema,
	reportingV1TriggerDailyStatementOutputPayloadSchema,
}
from './schema.js'

export type ReportingV1TriggerDailyStatementInputParameter = z.input<typeof reportingV1TriggerDailyStatementInputParameterSchema>

export type ReportingV1TriggerDailyStatementInputPayload = z.input<typeof reportingV1TriggerDailyStatementInputPayloadSchema>

export type ReportingV1TriggerDailyStatementOutputPayload = z.output<typeof reportingV1TriggerDailyStatementOutputPayloadSchema>
