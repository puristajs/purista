import { z } from 'zod'

export const identityServiceV1ConfigSchema = z.object({
	sessionTtlMs: z.number().int().positive().default(15 * 60 * 1000),
})

export type IdentityServiceV1Config = z.input<typeof identityServiceV1ConfigSchema>
