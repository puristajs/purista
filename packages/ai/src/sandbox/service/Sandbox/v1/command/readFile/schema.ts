import { z } from 'zod'
import { SandboxPayloadSchema } from '../../../../../types/SandboxDriver.js'

export const ReadFileInputSchema = SandboxPayloadSchema.extend({
	projectId: z.string().min(1),
	path: z.string().min(1),
})

export const ReadFileOutputSchema = z.string()

export type ReadFileInput = z.infer<typeof ReadFileInputSchema>
export type ReadFileOutput = z.infer<typeof ReadFileOutputSchema>
