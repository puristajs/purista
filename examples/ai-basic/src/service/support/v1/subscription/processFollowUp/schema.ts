import { extendApi } from '@purista/core'
import { z } from 'zod'

export const processFollowUpInputSchema = extendApi(
	z.object({
		sessionId: z.string().uuid().optional(),
		prompt: z.string().min(1),
		status: z.literal('queued'),
	}),
	{ title: 'Process follow-up input' },
)

export const processFollowUpInvokePayloadSchema = extendApi(
	z.object({
		message: z.string().min(1),
		prompt: z.string().min(1).optional(),
		sessionId: z.string().uuid().optional(),
		history: z.array(z.unknown()).optional().default([]),
		attachments: z.array(z.unknown()).optional().default([]),
	}),
	{ title: 'Process follow-up invoke payload' },
)

export const processFollowUpInvokeParameterSchema = extendApi(
	z.object({
		channel: z.enum(['subscription']),
		locale: z.string().optional(),
	}),
	{ title: 'Process follow-up invoke parameter' },
)
