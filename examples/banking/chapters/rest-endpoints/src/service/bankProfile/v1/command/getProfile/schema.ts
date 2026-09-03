import { z } from 'zod'

export const bankProfileV1GetProfileInputPayloadSchema = z.undefined()
export const bankProfileV1GetProfileInputParameterSchema = z.object({})
export const bankProfileV1GetProfileOutputPayloadSchema = z.object({
	name: z.string(),
	currency: z.literal('EUR'),
})
