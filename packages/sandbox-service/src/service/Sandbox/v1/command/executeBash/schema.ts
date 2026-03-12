import { z } from 'zod'
import { BashResultSchema, SandboxPayloadSchema } from '../../../../../types/SandboxDriver.js'

export const ExecuteBashInputSchema = SandboxPayloadSchema.extend({
	command: z.string(),
	cwd: z.string().optional(),
})

export const ExecuteBashOutputSchema = BashResultSchema

export type ExecuteBashInput = z.infer<typeof ExecuteBashInputSchema>
export type ExecuteBashOutput = z.infer<typeof ExecuteBashOutputSchema>
