import { agentProtocolEnvelopeSchema, toAgent2AgentReferenceMessage } from '@purista/ai'

import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import {
	runSupportA2aInputSchema,
	runSupportA2aInvokeParameterSchema,
	runSupportA2aInvokePayloadSchema,
	runSupportA2aOutputSchema,
} from './schema.js'

export const runSupportA2aCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('runSupportA2a', 'Invokes support agent and returns Agent2Agent-style messages')
	.canInvokeAgent('supportAgent', '1', {
		payloadSchema: runSupportA2aInvokePayloadSchema,
		parameterSchema: runSupportA2aInvokeParameterSchema,
	})
	.addPayloadSchema(runSupportA2aInputSchema)
	.addOutputSchema(runSupportA2aOutputSchema)
	.exposeAsHttpEndpoint('POST', 'support/a2a/call')
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
				responseFormat: payload.responseFormat,
				history: [],
				attachments: [],
			},
			{
				channel: 'command',
			},
		).final()
		const envelopes = Array.isArray(result)
			? agentProtocolEnvelopeSchema.array().parse(result)
			: agentProtocolEnvelopeSchema.array().parse((result as { history?: unknown[] }).history ?? [])
		return {
			messages: envelopes.map(toAgent2AgentReferenceMessage),
		}
	})
