import { normalizeAgentInvocationFinalResult, toMcpReferenceToolResult } from '@purista/ai'
import { HandledError, StatusCode } from '@purista/core'

import { deskV1ServiceBuilder } from '../../deskV1ServiceBuilder.js'
import { calculateInputSchema, calculateOutputSchema } from '../calculate/schema.js'
import { fetchWebsiteInputSchema, fetchWebsiteOutputSchema } from '../fetchWebsite/schema.js'
import { lookupFaqInputSchema, lookupFaqOutputSchema } from '../lookupFaq/schema.js'
import { type DeskMcpToolName, deskMcpToolTargets } from '../mcpTools.js'
import {
	runDeskMcpInputSchema,
	runDeskMcpInvokeParameterSchema,
	runDeskMcpInvokePayloadSchema,
	runDeskMcpOutputSchema,
} from './schema.js'

export const runDeskMcpCommandBuilder = deskV1ServiceBuilder
	.getCommandBuilder('runDeskMcp', 'Invokes MCP-exposed tools and returns MCP-style result payload')
	.canInvoke('desk', '1', 'lookupFaq', lookupFaqOutputSchema, lookupFaqInputSchema)
	.canInvoke('desk', '1', 'calculate', calculateOutputSchema, calculateInputSchema)
	.canInvoke('desk', '1', 'fetchWebsite', fetchWebsiteOutputSchema, fetchWebsiteInputSchema)
	.canInvokeAgent('researchAgent', '1', {
		payloadSchema: runDeskMcpInvokePayloadSchema,
		parameterSchema: runDeskMcpInvokeParameterSchema,
	})
	.canInvokeAgent('architectureReviewAgent', '1', {
		payloadSchema: runDeskMcpInvokePayloadSchema,
		parameterSchema: runDeskMcpInvokeParameterSchema,
	})
	.addPayloadSchema(runDeskMcpInputSchema)
	.addOutputSchema(runDeskMcpOutputSchema)
	.exposeAsHttpEndpoint('POST', 'desk/mcp/call')
	.setCommandFunction(async function (context, payload) {
		const toolName = payload.name as DeskMcpToolName
		const target = deskMcpToolTargets[toolName]
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
					? { type: 'json' as const, json: result }
					: { type: 'text' as const, text: String(result ?? '') },
			],
		})

		if (target.kind === 'command') {
			switch (target.commandName) {
				case 'lookupFaq':
					return toJsonContent(await context.service.desk['1'].lookupFaq(args as { question: string }, {}))
				case 'calculate':
					return toJsonContent(await context.service.desk['1'].calculate(args as { expression: string }, {}))
				case 'fetchWebsite':
					return toJsonContent(await context.service.desk['1'].fetchWebsite(args as { url: string }, {}))
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
		return toMcpReferenceToolResult(
			normalizeAgentInvocationFinalResult({
				result,
				agentName: target.agentName,
				serviceVersion: '1',
			}).envelopes,
		)
	})
