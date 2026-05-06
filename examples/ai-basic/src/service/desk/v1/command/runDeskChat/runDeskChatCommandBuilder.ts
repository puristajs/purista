import { deskV1ServiceBuilder } from '../../deskV1ServiceBuilder.js'
import {
	deskChatAgentInvokeParameterSchema,
	deskChatAgentInvokePayloadSchema,
	runDeskChatInputSchema,
	runDeskChatOutputSchema,
} from './schema.js'

export const runDeskChatCommandBuilder = deskV1ServiceBuilder
	.getCommandBuilder('runDeskChat', 'Runs the desk chat agent through context.invokeAgent')
	.canInvokeAgent('deskChatAgent', '1', {
		payloadSchema: deskChatAgentInvokePayloadSchema,
		parameterSchema: deskChatAgentInvokeParameterSchema,
	})
	.addPayloadSchema(runDeskChatInputSchema)
	.addOutputSchema(runDeskChatOutputSchema)
	.exposeAsHttpEndpoint('POST', 'desk/ask')
	.setCommandFunction(async function (context, payload) {
		const deskChatAgentInvoke = context.invokeAgent.deskChatAgent?.['1']
		if (!deskChatAgentInvoke) {
			throw new Error('deskChatAgent invoke binding is not configured')
		}
		const invokeCall = deskChatAgentInvoke.call
		if (!invokeCall) {
			throw new Error('deskChatAgent call handler is not configured')
		}
		const result = await invokeCall(
			{
				sessionId: payload.sessionId,
				message: payload.prompt,
				prompt: payload.prompt,
				context: payload.context,
				responseFormat: payload.responseFormat,
				history: [],
				attachments: [],
			},
			{
				channel: 'command',
			},
		).final()

		return {
			message: result.message ?? '',
		}
	})
