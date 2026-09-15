import { z } from 'zod'

export const transactionRecordedMetricName = 'app.transaction.recorded'

export const transactionRecordedMetricAttributesSchema = z.strictObject({
	direction: z.enum(['credit', 'debit']),
	amount_band: z.enum(['under_100_eur', 'at_least_100_eur']),
})

export const transactionRecordedMetricDefinition = {
	kind: 'counter',
	unit: '{transaction}',
	description: 'Successfully recorded synthetic transactions',
	attributes: transactionRecordedMetricAttributesSchema,
} as const
