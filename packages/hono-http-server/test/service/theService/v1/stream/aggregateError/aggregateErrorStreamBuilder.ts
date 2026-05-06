import { z } from 'zod'

import { theServiceServiceBuilder } from '../../theServiceServiceBuilder.js'

export const aggregateErrorStreamBuilder = theServiceServiceBuilder
	.getStreamBuilder('aggregateError', 'aggregate error stream')
	.exposeAsHttpStreamEndpoint('GET', 'aggregate-error')
	.setHttpStreamingMode('aggregate')
	.addFinalSchema(
		z.object({
			message: z.string(),
		}),
	)
	.setStreamFunction(async function (_context, _payload, _parameter, writer) {
		await writer.fail(new Error('aggregate failed'))
	})
