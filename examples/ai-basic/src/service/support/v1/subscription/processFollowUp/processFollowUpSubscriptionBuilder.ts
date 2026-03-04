import { getFinalMessageFromEnvelopes } from '../../../../../utils/agentResponse.js'
import { ServiceEvent } from '../../../../ServiceEvent.enum.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import { processFollowUpInputSchema } from './schema.js'

export const processFollowUpSubscriptionBuilder = supportV1ServiceBuilder
	.getSubscriptionBuilder('processFollowUp', 'Invokes supportAgent when support.requested is emitted')
	.subscribeToEvent(ServiceEvent.SupportRequested)
	.canInvokeAgent('supportAgent', '1')
	.addPayloadSchema(processFollowUpInputSchema)
	.setSubscriptionFunction(async function (context, payload) {
		const supportAgentInvoke = context.invokeAgent.supportAgent?.['1']
		if (!supportAgentInvoke) {
			throw new Error('supportAgent invoke binding is not configured')
		}
		const invokeCall = supportAgentInvoke.call
		if (!invokeCall) {
			throw new Error('supportAgent call handler is not configured')
		}
		const result = await invokeCall(
			{
				sessionId: payload.sessionId,
				message: payload.prompt,
				prompt: payload.prompt,
				history: [],
				attachments: [],
			},
			{
				channel: 'subscription',
			},
		).final()

		context.logger.info({ answer: getFinalMessageFromEnvelopes(result) }, 'Processed support follow-up event')
	})
