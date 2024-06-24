import { z } from 'zod'

import { theServiceServiceBuilder } from '../../theServiceServiceBuilder.js'
import {
	theServiceV1InvokeFooInputParameterSchema,
	theServiceV1InvokeFooInputPayloadSchema,
	theServiceV1InvokeFooOutputPayloadSchema,
} from './schema.js'

export const invokeFooFailedCommandBuilder = theServiceServiceBuilder
	.getCommandBuilder('invokeFooFailed', 'invokes foo command with wrong invoke schema')
	.addPayloadSchema(theServiceV1InvokeFooInputPayloadSchema)
	.addParameterSchema(theServiceV1InvokeFooInputParameterSchema)
	.addOutputSchema(theServiceV1InvokeFooOutputPayloadSchema)
	.canInvoke(
		'TheService',
		'1',
		'foo',
		z.object({
			payload: z.number(),
			parameter: z.number(),
		}),
	)
	.setCommandFunction(async function ({ service }, payload, parameter) {
		return service.TheService['1'].foo(payload, parameter)
	})
