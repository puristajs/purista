import { z } from 'zod'
import { CreateSandboxInputSchema } from '../createSandbox/schema.js'

export const EnsureSandboxInputSchema = CreateSandboxInputSchema

export const EnsureSandboxOutputSchema = z.object({
	sandboxId: z.string(),
	status: z.enum(['ready', 'starting', 'failed']),
	created: z.boolean(),
})

export type EnsureSandboxInput = z.infer<typeof EnsureSandboxInputSchema>
export type EnsureSandboxOutput = z.infer<typeof EnsureSandboxOutputSchema>
