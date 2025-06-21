import { z } from 'zod/v4'

export const eventBridgeClientConfigSchema = z.object({
	clientName: z.string().default('EventBridgeClient'),
})
