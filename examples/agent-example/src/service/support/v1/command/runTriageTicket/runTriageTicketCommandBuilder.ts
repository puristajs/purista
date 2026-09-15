import {
	supportV1TriageTicketInputPayloadSchema,
	supportV1TriageTicketOutputPayloadSchema,
	triageTicketAgent,
} from '../../harness/agent/triageTicket/triageTicketAgent.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const runTriageTicketCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('runTriageTicket', 'Classifies a support ticket with the mounted Harness agent')
	.addPayloadSchema(supportV1TriageTicketInputPayloadSchema)
	.addOutputSchema(supportV1TriageTicketOutputPayloadSchema)
	.canInvokeAgent(supportV1ServiceBuilder.harnessTarget(triageTicketAgent.contract))
	.exposeAsHttpEndpoint('POST', 'triage-ticket')
	.makeEndpointPublic()
	.setCommandFunction(async function ({ agent }, payload) {
		const result = await agent.Support['1'][triageTicketAgent.contract.id].run(payload, {
			sessionId: `ticket:${payload.ticketId}`,
		})
		return result.outcome.output
	})
