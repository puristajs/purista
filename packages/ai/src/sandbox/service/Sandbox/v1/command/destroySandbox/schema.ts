import { z } from 'zod'
import { SandboxPayloadSchema } from '../../../../../types/SandboxDriver.js'

export const DestroySandboxInputSchema = SandboxPayloadSchema.extend({
	projectId: z.string().min(1),
})

export const DestroySandboxOutputSchema = z.object({
	sandboxId: z.string(),
	destroyed: z.boolean(),
})

export type DestroySandboxInput = z.infer<typeof DestroySandboxInputSchema>
export type DestroySandboxOutput = z.infer<typeof DestroySandboxOutputSchema>
