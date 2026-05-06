import { z } from 'zod'
import { SandboxFileContentSchema, SandboxPayloadSchema } from '../../../../../types/SandboxDriver.js'

export const WriteFilesInputSchema = SandboxPayloadSchema.extend({
	projectId: z.string().min(1),
	files: z.record(z.string(), SandboxFileContentSchema),
})

export const WriteFilesOutputSchema = z.object({
	updated: z.number().int().nonnegative(),
})

export type WriteFilesInput = z.infer<typeof WriteFilesInputSchema>
export type WriteFilesOutput = z.infer<typeof WriteFilesOutputSchema>
