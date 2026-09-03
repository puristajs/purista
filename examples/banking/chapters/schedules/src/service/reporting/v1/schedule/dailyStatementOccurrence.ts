import { z } from 'zod'

export const dailyStatementDueEventName = 'reporting.daily-statement.due.v1'

export const dailyStatementOccurrenceSchema = z.strictObject({
	id: z.string().trim().min(1),
	scheduledFor: z.iso.datetime(),
	accountId: z.string().trim().min(1),
	transactionId: z.uuid(),
})

export type DailyStatementOccurrence = z.infer<typeof dailyStatementOccurrenceSchema>
