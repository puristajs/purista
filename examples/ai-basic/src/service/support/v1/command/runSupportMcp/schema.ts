import { extendApi } from '@purista/core'
import { z } from 'zod/v4'
import { supportMcpToolTargets } from '../mcpTools.js'
import { supportAgentInvokeParameterSchema, supportAgentInvokePayloadSchema } from '../runSupportAgent/schema.js'

export const runSupportMcpInputSchema = extendApi(
	z.object({
		name: z
			.string()
			.min(1)
			.refine(value => value in supportMcpToolTargets, 'Unknown MCP tool name'),
		arguments: z.record(z.string(), z.unknown()).optional(),
	}),
	{ title: 'Run support MCP input' },
)

export const runSupportMcpOutputSchema = extendApi(
	z.object({
		content: z.array(
			z.union([
				z.object({ type: z.literal('text'), text: z.string() }),
				z.object({ type: z.literal('json'), json: z.record(z.string(), z.unknown()) }),
			]),
		),
		isError: z.boolean().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	}),
	{ title: 'MCP reference tool result' },
)

export const runSupportMcpInvokePayloadSchema = supportAgentInvokePayloadSchema

export const runSupportMcpInvokeParameterSchema = extendApi(
	supportAgentInvokeParameterSchema.extend({
		channel: z.literal('command'),
	}),
	{ title: 'Run support MCP invoke parameter' },
)
