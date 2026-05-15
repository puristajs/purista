import { z } from 'zod'

export const supportV1TriageTicketInputPayloadSchema = z.object({
	ticketId: z.string().min(1),
	text: z.string().min(1),
})

export const supportV1TriageTicketOutputPayloadSchema = z.object({
	priority: z.enum(['low', 'normal', 'high']),
	reason: z.string().min(1),
})

export const supportV1TriageTicketJsonSchema = {
	type: 'object',
	properties: {
		priority: { enum: ['low', 'normal', 'high'] },
		reason: { type: 'string' },
	},
	required: ['priority', 'reason'],
	additionalProperties: false,
}
