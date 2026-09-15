import { z } from 'zod'

export const monitoringV1ObserveLargeDebitInputPayloadSchema = z.object({
	transactionId: z.uuid(),
	accountId: z.string().trim().min(1),
	amountCents: z.number().int().positive(),
	direction: z.enum(['credit', 'debit']),
})

export const monitoringV1ObserveLargeDebitInputParameterSchema = z.undefined()
