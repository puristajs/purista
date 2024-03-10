import { z } from 'zod'

export const eventBridgeClientConfigSchema = z.object({
  clientName: z.string().default('EventBridgeClient'),
})
