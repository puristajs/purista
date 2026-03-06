import { agentProtocolEnvelopeSchema, toMcpReferenceToolResult } from '@purista/ai'
import { HandledError, StatusCode } from '@purista/core'

import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import { calculateInputSchema, calculateOutputSchema } from '../calculate/schema.js'
import { fetchWebsiteInputSchema, fetchWebsiteOutputSchema } from '../fetchWebsite/schema.js'
import { lookupFaqInputSchema, lookupFaqOutputSchema } from '../lookupFaq/schema.js'
import { type SupportMcpToolName, supportMcpToolTargets } from '../mcpTools.js'
import {
	runSupportMcpInputSchema,
	runSupportMcpInvokeParameterSchema,
	runSupportMcpInvokePayloadSchema,
	runSupportMcpOutputSchema,
} from './schema.js'

export const runSupportMcpCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('runSupportMcp', 'Invokes MCP-exposed tools and returns MCP-style result payload')
	.canInvoke('support', '1', 'lookupFaq', lookupFaqOutputSchema, lookupFaqInputSchema)
	.canInvoke('support', '1', 'calculate', calculateOutputSchema, calculateInputSchema)
	.canInvoke('support', '1', 'fetchWebsite', fetchWebsiteOutputSchema, fetchWebsiteInputSchema)
	.canInvokeAgent('supportAgent', '1', {
		payloadSchema: runSupportMcpInvokePayloadSchema,
		parameterSchema: runSupportMcpInvokeParameterSchema,
	})
	.canInvokeAgent('triageAgent', '1', {
		payloadSchema: runSupportMcpInvokePayloadSchema,
		parameterSchema: runSupportMcpInvokeParameterSchema,
	})
	.addPayloadSchema(runSupportMcpInputSchema)
	.addOutputSchema(runSupportMcpOutputSchema)
	.exposeAsHttpEndpoint('POST', 'support/mcp/call')
	.setCommandFunction(async function (context, payload) {
		const toolName = payload.name as SupportMcpToolName
		const target = supportMcpToolTargets[toolName]
		if (!target) {
			throw new HandledError(StatusCode.BadRequest, `Unknown MCP tool "${payload.name}"`)
		}

		const args = payload.arguments ?? {}
		const toPrompt = () => {
			const prompt = typeof args.prompt === 'string' && args.prompt.trim().length > 0 ? args.prompt.trim() : undefined
			if (!prompt) {
				throw new HandledError(StatusCode.BadRequest, 'MCP agent tools require arguments.prompt')
			}
			return prompt
		}

		const toJsonContent = (result: unknown) => ({
			content: [
				typeof result === 'object' && result !== null
					? { type: 'json' as const, json: result as Record<string, unknown> }
					: { type: 'text' as const, text: String(result ?? '') },
			],
		})

		if (target.kind === 'command') {
			switch (target.commandName) {
				case 'lookupFaq':
					return toJsonContent(await context.service.support['1'].lookupFaq(args as { question: string }, {}))
				case 'calculate':
					return toJsonContent(await context.service.support['1'].calculate(args as { expression: string }, {}))
				case 'fetchWebsite':
					return toJsonContent(await context.service.support['1'].fetchWebsite(args as { url: string }, {}))
				default:
					throw new HandledError(StatusCode.BadRequest, `Unsupported MCP command tool "${payload.name}"`)
			}
		}

		const invokeList = context.invokeAgent[target.agentName]?.['1']
		const invokeCall = invokeList?.call
		if (!invokeCall) {
			throw new HandledError(
				StatusCode.InternalServerError,
				`Agent invoke binding for "${target.agentName}" is missing`,
			)
		}

		const prompt = toPrompt()
		const result = await invokeCall(
			{
				sessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
				message: prompt,
				prompt,
				context: typeof args.context === 'string' ? args.context : undefined,
				responseFormat:
					args.responseFormat === 'json' || args.responseFormat === 'text' ? args.responseFormat : undefined,
				history: [],
				attachments: [],
			},
			{ channel: 'command' },
		).final()

		const envelopes = Array.isArray(result)
			? agentProtocolEnvelopeSchema.array().parse(result)
			: agentProtocolEnvelopeSchema.array().parse((result as { history?: unknown[] }).history ?? [])
		return toMcpReferenceToolResult(envelopes)
	})
