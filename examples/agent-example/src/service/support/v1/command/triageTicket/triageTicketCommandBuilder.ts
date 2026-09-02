import {
	supportV1TriageTicketInputPayloadSchema,
	supportV1TriageTicketOutputPayloadSchema,
} from '../../../../../harness/support/agent/triageTicketAgent.js'
import { supportHarness } from '../../../../../harness/support/supportHarness.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const triageTicketCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('triageTicket', 'Classifies a support ticket with the mounted Harness agent')
	.addPayloadSchema(supportV1TriageTicketInputPayloadSchema)
	.addOutputSchema(supportV1TriageTicketOutputPayloadSchema)
	.canInvokeAgent('Support', '1', 'triage_ticket', supportHarness.contracts.agents.triage_ticket)
	.exposeAsHttpEndpoint('POST', 'triage-ticket')
	.makeEndpointPublic()
	.setCommandFunction(async function ({ agent }, payload) {
		const outcome = await agent.Support['1'].triage_ticket.run(payload, { sessionId: `ticket:${payload.ticketId}` })
		if (outcome.status !== 'completed') throw new Error('The triage agent was interrupted unexpectedly.')
		return outcome.output
	})
