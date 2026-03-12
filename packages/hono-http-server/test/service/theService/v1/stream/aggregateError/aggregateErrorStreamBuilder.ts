import { z } from 'zod/v4'

import { theServiceServiceBuilder } from '../../theServiceServiceBuilder.js'

const envelopeSchema = z.object({
	version: z.string(),
	messageId: z.string(),
	conversationId: z.string(),
	timestamp: z.string(),
	actor: z.object({
		service: z.string(),
		version: z.string(),
		agent: z.string(),
	}),
	frame: z.object({
		kind: z.literal('error'),
		code: z.string(),
		message: z.string(),
		handled: z.boolean().optional(),
	}),
})

export const aggregateErrorStreamBuilder = theServiceServiceBuilder
	.getStreamBuilder('aggregateError', 'aggregate error stream')
	.exposeAsHttpStreamEndpoint('GET', 'aggregate-error')
	.setHttpStreamingMode('aggregate')
	.addFinalSchema(
		z.object({
			envelopes: envelopeSchema.array(),
		}),
	)
	.setStreamFunction(async function (_context, _payload, _parameter, writer) {
		const envelope = {
			version: 'purista.ai/1.0',
			messageId: 'msg-error',
			conversationId: 'conversation-error',
			timestamp: new Date().toISOString(),
			actor: {
				service: 'theService',
				version: '1',
				agent: 'aggregateError',
			},
			frame: {
				kind: 'error',
				code: 'AggregateError',
				message: 'aggregate failed',
				handled: true,
			},
		}
		await writer.write(envelope)
		await writer.close({
			envelopes: [envelope],
		})
	})
