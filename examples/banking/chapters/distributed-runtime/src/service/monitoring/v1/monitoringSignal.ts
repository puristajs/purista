import { z } from 'zod'

export const largeDebitThresholdCents = 10_000
export const latestLargeDebitSignalKey = 'monitoring.tenant-example.latest-large-debit'

export const largeDebitSignalSchema = z.strictObject({
	transactionId: z.uuid(),
	accountId: z.string().trim().min(1),
	amountCents: z.number().int().positive(),
})

export type LargeDebitSignal = z.output<typeof largeDebitSignalSchema>
