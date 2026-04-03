import { z } from 'zod'
import { BashResultSchema, SandboxPayloadSchema } from '../../../../../types/SandboxDriver.js'

export const ExecuteBashInputSchema = SandboxPayloadSchema.extend({
	command: z.string(),
	cwd: z.string().optional(),
	timeoutMs: z
		.number()
		.int()
		.positive()
		.max(30 * 60_000)
		.optional(),
})

export const ExecuteBashOutputSchema = BashResultSchema

export type ExecuteBashInput = z.infer<typeof ExecuteBashInputSchema>
export type ExecuteBashOutput = z.infer<typeof ExecuteBashOutputSchema>
