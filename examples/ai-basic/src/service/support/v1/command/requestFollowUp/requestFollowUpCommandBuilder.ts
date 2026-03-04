import { ServiceEvent } from '../../../../ServiceEvent.enum.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import { requestFollowUpInputSchema, requestFollowUpOutputSchema } from './schema.js'

export const requestFollowUpCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('requestFollowUp', 'Publishes an event handled by a subscription that invokes the agent')
	.setSuccessEventName(ServiceEvent.SupportRequested)
	.addPayloadSchema(requestFollowUpInputSchema)
	.addOutputSchema(requestFollowUpOutputSchema)
	.exposeAsHttpEndpoint('POST', 'support/follow-up')
	.setCommandFunction(async function (_context, payload) {
		return {
			sessionId: payload.sessionId,
			prompt: payload.prompt,
			status: 'queued' as const,
		}
	})
