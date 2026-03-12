import { z } from 'zod'

export const CreateSandboxInputSchema = z.object({
	organizationId: z.string(),
	projectId: z.string(),
	userId: z.string(),
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
