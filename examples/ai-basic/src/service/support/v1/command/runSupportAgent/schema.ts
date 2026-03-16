import { extendApi } from '@purista/core'
import { z } from 'zod'

export const runSupportAgentInputSchema = extendApi(
	z.object({
		sessionId: z.string().min(1).optional(),
		prompt: z.string().min(1),
		context: z.string().optional(),
		responseFormat: z.enum(['text', 'json']).optional(),
	}),
	{ title: 'Run support agent input' },
)

export const runSupportAgentOutputSchema = extendApi(
	z.object({
		message: z.string(),
	}),
	{ title: 'Run support agent output' },
)

export const supportAgentInvokePayloadSchema = extendApi(
	z.object({
		message: z.string().min(1),
		prompt: z.string().min(1).optional(),
		sessionId: z.string().min(1).optional(),
		context: z.string().optional(),
		responseFormat: z.enum(['text', 'json']).optional(),
		history: z.array(z.unknown()).optional().default([]),
		attachments: z.array(z.unknown()).optional().default([]),
	}),
	{ title: 'Support agent invoke payload' },
)

export const supportAgentInvokeParameterSchema = extendApi(
	z.object({
		channel: z.enum(['command', 'subscription', 'queue', 'stream']),
		locale: z.string().optional(),
	}),
	{ title: 'Support agent invoke parameter' },
)
