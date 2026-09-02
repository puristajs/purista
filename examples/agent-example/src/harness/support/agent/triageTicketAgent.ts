import { type BuilderState, defineHarnessModule, type ModelAlias } from '@purista/harness'
import { z } from 'zod'

export const supportV1TriageTicketInputPayloadSchema = z.object({
	ticketId: z.string().min(1),
	text: z.string().min(1),
})

export const supportV1TriageTicketOutputPayloadSchema = z.object({
	priority: z.enum(['low', 'normal', 'high']),
	reason: z.string().min(1),
})

type PrimaryModelState = BuilderState & { models: { primary: ModelAlias } }

/** Classifies a support ticket without depending on PURISTA runtime code. */
export const triageTicketAgent = defineHarnessModule<PrimaryModelState>()('support.agent.triage-ticket', {
	version: '1.0.0',
	register(builder) {
		return builder.agent('triage_ticket', {
			model: 'primary',
			input: supportV1TriageTicketInputPayloadSchema,
			output: supportV1TriageTicketOutputPayloadSchema,
			updates: 'object-snapshot',
			instructions: 'Classify the support ticket as low, normal, or high priority and give one concise reason.',
		})
	},
})
