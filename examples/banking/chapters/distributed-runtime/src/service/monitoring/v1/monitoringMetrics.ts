import { z } from 'zod'

export const largeDebitSignalMetricName = 'app.monitoring.large_debit.signals'

export const largeDebitSignalMetricDefinition = {
	kind: 'counter',
	unit: '{signal}',
	description: 'Outcomes while storing large debit monitoring signals',
	attributes: z.strictObject({
		outcome: z.enum(['stored', 'store_error']),
	}),
} as const
