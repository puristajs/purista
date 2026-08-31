import { z } from 'zod'
import { accountIdSchema } from '../../../../../transaction.js'

export const bankingV1GetAccountOverviewInputPayloadSchema = z.undefined()
export const bankingV1GetAccountOverviewInputParameterSchema = z.object({ accountId: accountIdSchema })
export const bankingV1GetAccountOverviewOutputPayloadSchema = z.object({
	tenantId: z.string().min(1),
	accountId: accountIdSchema,
	transactionCount: z.number().int().nonnegative(),
})
