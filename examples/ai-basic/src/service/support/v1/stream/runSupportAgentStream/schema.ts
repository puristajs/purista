import { agentProtocolEnvelopeSchema } from '@purista/ai'
import { extendApi } from '@purista/core'
import { z } from 'zod'

import {
	runSupportAgentInputSchema,
	supportAgentInvokeParameterSchema,
	supportAgentInvokePayloadSchema,
} from '../../command/runSupportAgent/schema.js'

export const runSupportAgentStreamInputSchema = runSupportAgentInputSchema

export const runSupportAgentStreamParameterSchema = extendApi(
	z.object({
		locale: z.string().optional(),
	}),
	{ title: 'Run support agent stream parameter' },
)

export const runSupportAgentStreamChunkSchema = extendApi(agentProtocolEnvelopeSchema, {
	title: 'Run support agent stream chunk',
})

export const runSupportAgentStreamFinalSchema = extendApi(
	z.object({
		message: z.string().optional(),
		envelopes: agentProtocolEnvelopeSchema.array(),
	}),
	{ title: 'Run support agent stream final payload' },
)

export const runSupportAgentStreamInvokePayloadSchema = supportAgentInvokePayloadSchema

export const runSupportAgentStreamInvokeParameterSchema = extendApi(
	supportAgentInvokeParameterSchema.extend({
		channel: z.literal('stream'),
	}),
	{ title: 'Run support agent stream invoke parameter' },
)
