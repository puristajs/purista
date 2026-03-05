import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

export const getMcpToolsOutputSchema = extendApi(
	z.object({
		tools: z.array(
			z.object({
				name: z.string(),
				description: z.string().optional(),
				parameters: z.record(z.string(), z.unknown()).optional(),
			}),
		),
	}),
	{ title: 'MCP tool descriptors' },
)
