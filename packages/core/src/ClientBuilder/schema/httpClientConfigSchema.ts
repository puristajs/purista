import { z } from 'zod/v4'

export const httpClientConfigSchema = z.object({
	clientName: z.string().default('HttpClient'),
})
