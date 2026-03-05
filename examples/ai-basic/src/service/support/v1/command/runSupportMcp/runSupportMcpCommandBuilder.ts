import { agentProtocolEnvelopeSchema, toMcpReferenceToolResult } from '@purista/ai'

import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import {
	runSupportMcpInputSchema,
	runSupportMcpInvokeParameterSchema,
	runSupportMcpInvokePayloadSchema,
	runSupportMcpOutputSchema,
} from './schema.js'

export const runSupportMcpCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('runSupportMcp', 'Invokes support agent and returns MCP-style result payload')
	.canInvokeAgent('supportAgent', '1', {
		payloadSchema: runSupportMcpInvokePayloadSchema,
		parameterSchema: runSupportMcpInvokeParameterSchema,
	})
	.addPayloadSchema(runSupportMcpInputSchema)
	.addOutputSchema(runSupportMcpOutputSchema)
	.exposeAsHttpEndpoint('POST', 'support/mcp/call')
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
		return toMcpReferenceToolResult(envelopes)
	})
