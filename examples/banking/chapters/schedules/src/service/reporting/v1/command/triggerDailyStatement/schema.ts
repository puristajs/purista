import { z } from 'zod'
import { dailyStatementOccurrenceSchema } from '../../schedule/dailyStatementOccurrence.js'

export const reportingV1TriggerDailyStatementInputParameterSchema = z.object({})
export const reportingV1TriggerDailyStatementInputPayloadSchema = dailyStatementOccurrenceSchema
export const reportingV1TriggerDailyStatementOutputPayloadSchema = z.strictObject({
	occurrenceId: z.string().trim().min(1),
})
