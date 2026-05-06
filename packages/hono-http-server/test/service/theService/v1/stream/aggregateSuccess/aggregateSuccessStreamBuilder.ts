import { z } from 'zod'

import { theServiceServiceBuilder } from '../../theServiceServiceBuilder.js'

const eventSchema = z.object({
	type: z.literal('message'),
	role: z.string(),
	content: z.string(),
	final: z.boolean().optional(),
})

export const aggregateSuccessStreamBuilder = theServiceServiceBuilder
	.getStreamBuilder('aggregateSuccess', 'aggregate success stream')
	.exposeAsHttpStreamEndpoint('GET', 'aggregate-success')
	.setHttpStreamingMode('aggregate')
	.addFinalSchema(
		z.object({
			message: z.string(),
			events: eventSchema.array(),
		}),
	)
	.setStreamFunction(async function (_context, _payload, _parameter, writer) {
		const event: z.infer<typeof eventSchema> = {
			type: 'message',
			role: 'assistant',
			content: 'aggregate ok',
			final: true,
		}
		await writer.write(event)
		await writer.close({
			message: 'aggregate ok',
			events: [event],
		})
	})
