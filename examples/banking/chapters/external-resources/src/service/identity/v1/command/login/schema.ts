import { z } from 'zod'

export const identityV1LoginInputParameterSchema = z.object({})
export const identityV1LoginInputPayloadSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
})
export const identityV1LoginOutputPayloadSchema = z.object({
	sessionToken: z.uuid(),
	displayName: z.string(),
	expiresAt: z.number().int().positive(),
})
