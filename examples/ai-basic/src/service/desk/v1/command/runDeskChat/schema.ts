import { extendApi } from '@purista/core'
import { z } from 'zod'

export const runDeskChatInputSchema = extendApi(
	z.object({
		sessionId: z.string().min(1).optional(),
		prompt: z.string().min(1),
		context: z.string().optional(),
		responseFormat: z.enum(['text', 'json']).optional(),
	}),
	{ title: 'Run desk chat input' },
)

export const runDeskChatOutputSchema = extendApi(
	z.object({
		message: z.string(),
	}),
	{ title: 'Run desk chat output' },
)

export const deskChatAgentInvokePayloadSchema = extendApi(
	z.object({
		message: z.string().min(1),
		prompt: z.string().min(1).optional(),
		sessionId: z.string().min(1).optional(),
		context: z.string().optional(),
		responseFormat: z.enum(['text', 'json']).optional(),
		history: z.array(z.unknown()).optional().default([]),
		attachments: z.array(z.unknown()).optional().default([]),
	}),
	{ title: 'Desk chat agent invoke payload' },
)

export const deskChatAgentInvokeParameterSchema = extendApi(
	z.object({
		channel: z.enum(['command', 'subscription', 'queue', 'stream']),
		locale: z.string().optional(),
	}),
	{ title: 'Desk chat agent invoke parameter' },
)
