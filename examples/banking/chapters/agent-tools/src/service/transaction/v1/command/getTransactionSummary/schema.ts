import { z } from 'zod'

export const getTransactionSummaryPayloadSchema = z.strictObject({
	accountId: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/),
	transactionId: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/),
})

export const getTransactionSummaryParameterSchema = z.strictObject({})

export const getTransactionSummaryOutputSchema = z.strictObject({
	transactionId: z.string(),
	accountId: z.string(),
	tenantId: z.string(),
	status: z.enum(['pending', 'booked', 'rejected']),
	amount: z.number(),
	currency: z.string().length(3),
})
