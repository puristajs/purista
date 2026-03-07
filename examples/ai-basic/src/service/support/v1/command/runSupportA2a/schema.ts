import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

import {
	runSupportAgentInputSchema,
	supportAgentInvokeParameterSchema,
	supportAgentInvokePayloadSchema,
} from '../runSupportAgent/schema.js'

export const runSupportA2aInputSchema = runSupportAgentInputSchema

export const runSupportA2aOutputSchema = extendApi(
	z.object({
		messages: z.array(
			z.object({
				id: z.string(),
				threadId: z.string(),
				parentId: z.string().optional(),
				timestamp: z.string(),
				sender: z.object({
					service: z.string(),
					version: z.string().optional(),
					agent: z.string().optional(),
					instanceId: z.string().optional(),
				}),
				frameType: z.string(),
				payload: z.record(z.string(), z.unknown()),
				metadata: z.record(z.string(), z.unknown()).optional(),
			}),
		),
	}),
	{ title: 'Agent2Agent reference message list' },
)

export const runSupportA2aInvokePayloadSchema = supportAgentInvokePayloadSchema

export const runSupportA2aInvokeParameterSchema = extendApi(
	supportAgentInvokeParameterSchema.extend({
		channel: z.literal('command'),
	}),
	{ title: 'Run support A2A invoke parameter' },
)
