import { extendApi } from '@purista/core'
import { z } from 'zod'

import {
	deskChatAgentInvokeParameterSchema,
	deskChatAgentInvokePayloadSchema,
	runDeskChatInputSchema,
} from '../runDeskChat/schema.js'

export const runDeskA2aInputSchema = runDeskChatInputSchema

export const runDeskA2aOutputSchema = extendApi(
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

export const runDeskA2aInvokePayloadSchema = deskChatAgentInvokePayloadSchema

export const runDeskA2aInvokeParameterSchema = extendApi(
	deskChatAgentInvokeParameterSchema.extend({
		channel: z.literal('command'),
	}),
	{ title: 'Run desk A2A invoke parameter' },
)
