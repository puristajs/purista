import { z } from 'zod'

export const bankingV1GetBankInfoInputPayloadSchema = z.undefined()
export const bankingV1GetBankInfoInputParameterSchema = z.object({})
export const bankingV1GetBankInfoOutputPayloadSchema = z.object({
	name: z.string(),
	currency: z.literal('EUR'),
})
