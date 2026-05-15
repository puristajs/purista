import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import {
	supportV1TriageTicketInputPayloadSchema,
	supportV1TriageTicketJsonSchema,
	supportV1TriageTicketOutputPayloadSchema,
} from './schema.js'

export const triageTicketAgentBuilder = supportV1ServiceBuilder
	.getAgentQueueBuilder('triageTicket', 'Classifies support tickets by urgency')
	.addPayloadSchema(supportV1TriageTicketInputPayloadSchema)
	.addOutputSchema(supportV1TriageTicketOutputPayloadSchema)
	.addModel('primary', {
		model: 'support-triage',
		capabilities: ['object'] as const,
		defaults: { temperature: 0 },
	})
	.exposeAsHttpEndpoint('POST', 'triage-ticket', { streamingMode: 'aggregate' })
	.makeEndpointPublic()
	.setRunFunction(async context => {
		const result = await context.harness.models.primary.object(
			{
				messages: [
					{
						role: 'user',
						content: `Classify ticket ${context.payload.ticketId}: ${context.payload.text}`,
					},
				],
				schema: supportV1TriageTicketJsonSchema,
			},
			context.signal,
		)

		return supportV1TriageTicketOutputPayloadSchema.parse(result.object)
	})
