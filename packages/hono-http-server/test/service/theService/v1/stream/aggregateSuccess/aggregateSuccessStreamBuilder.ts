import { z } from 'zod'

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
		kind: z.literal('message'),
		role: z.string(),
		content: z.string(),
		final: z.boolean().optional(),
	}),
})

export const aggregateSuccessStreamBuilder = theServiceServiceBuilder
	.getStreamBuilder('aggregateSuccess', 'aggregate success stream')
	.exposeAsHttpStreamEndpoint('GET', 'aggregate-success')
	.setHttpStreamingMode('aggregate')
	.addFinalSchema(
		z.object({
			message: z.string(),
			envelopes: envelopeSchema.array(),
		}),
	)
	.setStreamFunction(async function (_context, _payload, _parameter, writer) {
		const envelope: z.infer<typeof envelopeSchema> = {
			version: 'purista.ai/1.0',
			messageId: 'msg-success',
			conversationId: 'conversation-success',
			timestamp: new Date().toISOString(),
			actor: {
				service: 'theService',
				version: '1',
				agent: 'aggregateSuccess',
			},
			frame: {
				kind: 'message',
				role: 'assistant',
				content: 'aggregate ok',
				final: true,
			},
		}
		await writer.write(envelope)
		await writer.close({
			message: 'aggregate ok',
			envelopes: [envelope],
		})
	})
