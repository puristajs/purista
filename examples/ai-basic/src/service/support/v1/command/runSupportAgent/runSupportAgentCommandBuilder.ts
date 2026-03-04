import { getFinalMessageFromEnvelopes } from '../../../../../utils/agentResponse.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import { runSupportAgentInputSchema, runSupportAgentOutputSchema } from './schema.js'

export const runSupportAgentCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('runSupportAgent', 'Runs the support agent through context.invokeAgent')
	.canInvokeAgent('supportAgent', '1')
	.addPayloadSchema(runSupportAgentInputSchema)
	.addOutputSchema(runSupportAgentOutputSchema)
	.exposeAsHttpEndpoint('POST', 'support/ask')
	.setCommandFunction(async function (context, payload) {
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
				context: payload.context,
				history: [],
				attachments: [],
			},
			{
				channel: 'command',
			},
		).final()

		return {
			message: getFinalMessageFromEnvelopes(result),
		}
	})
