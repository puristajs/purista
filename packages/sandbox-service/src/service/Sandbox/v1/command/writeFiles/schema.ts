import { z } from 'zod'
import { SandboxPayloadSchema } from '../../../../../types/SandboxDriver.js'

export const WriteFilesInputSchema = SandboxPayloadSchema.extend({
	files: z.record(z.string(), z.string()),
})

export const WriteFilesOutputSchema = z.object({
	updated: z.number().int().nonnegative(),
})

export type WriteFilesInput = z.infer<typeof WriteFilesInputSchema>
export type WriteFilesOutput = z.infer<typeof WriteFilesOutputSchema>
