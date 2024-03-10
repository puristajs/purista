import { z } from 'zod'

export const httpClientConfigSchema = z.object({
  clientName: z.string().default('HttpClient'),
})
