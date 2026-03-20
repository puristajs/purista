import { z } from 'zod'
import { SandboxScopeSchema } from '../../../../../types/SandboxDriver.js'

export const CreateSandboxInputSchema = z.object({
	projectId: z.string(),
	organizationId: z.string().optional(),
	userId: z.string().optional(),
	scope: SandboxScopeSchema.optional(),
	/** Optional Git and GitHub configuration */
	gitConfig: z
		.object({
			username: z.string(),
			email: z.string(),
			/** GitHub Personal Access Token or OAuth token */
			token: z.string().optional(),
		})
		.optional(),
})

export const CreateSandboxOutputSchema = z.object({
	sandboxId: z.string(),
	status: z.enum(['starting', 'ready', 'failed']),
})

export type CreateSandboxInput = z.infer<typeof CreateSandboxInputSchema>
export type CreateSandboxOutput = z.infer<typeof CreateSandboxOutputSchema>
