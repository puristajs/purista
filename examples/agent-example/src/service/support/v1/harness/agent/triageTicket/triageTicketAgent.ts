import { defineAgent } from '@purista/harness'
import { z } from 'zod'

export const supportV1TriageTicketInputPayloadSchema = z.object({
	ticketId: z.string().min(1),
	text: z.string().min(1),
})

export const supportV1TriageTicketOutputPayloadSchema = z.object({
	priority: z.enum(['low', 'normal', 'high']),
	reason: z.string().min(1),
})

/** Classifies a support ticket without depending on PURISTA runtime code. */
export const triageTicketAgent = defineAgent('triageTicket', {
	input: supportV1TriageTicketInputPayloadSchema,
	output: supportV1TriageTicketOutputPayloadSchema,
	instructions: 'Classify the support ticket as low, normal, or high priority and give one concise reason.',
	prompt: input => ({ role: 'user', content: `Ticket ${input.ticketId}: ${input.text}` }),
})
