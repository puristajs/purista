import { z } from 'zod/v4'

// define the input payload
export const emailV1SendWelcomeEmailInputPayloadSchema = z.object({
	userId: z.string().uuid(),
})

export const emailV1SendWelcomeEmailOutputPayloadSchema = z.object({
	userId: z.string().uuid(),
})
