import { jsonValueSchema } from '@purista/ai'
import { extendApi } from '@purista/core'
import { z } from 'zod'
import { deskMcpToolTargets } from '../mcpTools.js'
import { deskChatAgentInvokeParameterSchema, deskChatAgentInvokePayloadSchema } from '../runDeskChat/schema.js'

export const runDeskMcpInputSchema = extendApi(
	z.object({
		name: z
			.string()
			.min(1)
			.refine(value => value in deskMcpToolTargets, 'Unknown MCP tool name'),
		arguments: z.record(z.string(), z.unknown()).optional(),
	}),
	{ title: 'Run desk MCP input' },
)

export const runDeskMcpOutputSchema = extendApi(
	z.object({
		content: z.array(
			z.union([
				z.object({ type: z.literal('text'), text: z.string() }),
				z.object({ type: z.literal('json'), json: jsonValueSchema }),
			]),
		),
		isError: z.boolean().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	}),
	{ title: 'MCP reference tool result' },
)

export const runDeskMcpInvokePayloadSchema = deskChatAgentInvokePayloadSchema

export const runDeskMcpInvokeParameterSchema = extendApi(
	deskChatAgentInvokeParameterSchema.extend({
		channel: z.literal('command'),
	}),
	{ title: 'Run desk MCP invoke parameter' },
)
