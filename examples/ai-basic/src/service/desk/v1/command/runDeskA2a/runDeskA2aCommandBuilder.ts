import { normalizeAgentInvocationFinalResult, toAgent2AgentReferenceMessage } from '@purista/ai'

import { deskV1ServiceBuilder } from '../../deskV1ServiceBuilder.js'
import {
	runDeskA2aInputSchema,
	runDeskA2aInvokeParameterSchema,
	runDeskA2aInvokePayloadSchema,
	runDeskA2aOutputSchema,
} from './schema.js'

export const runDeskA2aCommandBuilder = deskV1ServiceBuilder
	.getCommandBuilder('runDeskA2a', 'Invokes the desk chat agent and returns Agent2Agent-style messages')
	.canInvokeAgent('deskChatAgent', '1', {
		payloadSchema: runDeskA2aInvokePayloadSchema,
		parameterSchema: runDeskA2aInvokeParameterSchema,
	})
	.addPayloadSchema(runDeskA2aInputSchema)
	.addOutputSchema(runDeskA2aOutputSchema)
	.exposeAsHttpEndpoint('POST', 'desk/a2a/call')
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
		const finalResult = normalizeAgentInvocationFinalResult({
			result,
			agentName: 'deskChatAgent',
			serviceVersion: '1',
		})
		return {
			messages: finalResult.envelopes.map(toAgent2AgentReferenceMessage),
		}
	})
