import { z } from 'zod'

export const classifySupportMessageInputSchema = z.strictObject({
	messageId: z.string().trim().min(1).max(80),
	text: z.string().trim().min(1).max(2_000),
})

export const classifySupportMessageOutputSchema = z.strictObject({
	category: z.enum(['account_access', 'card', 'transfer', 'other']),
	urgency: z.enum(['normal', 'urgent']),
	reason: z.string().trim().min(1).max(240),
})
