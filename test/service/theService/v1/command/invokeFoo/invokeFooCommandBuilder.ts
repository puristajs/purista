import { z } from 'zod/v4'

import { theServiceServiceBuilder } from '../../theServiceServiceBuilder.js'
import {
	theServiceV1InvokeFooInputParameterSchema,
	theServiceV1InvokeFooInputPayloadSchema,
	theServiceV1InvokeFooOutputPayloadSchema,
} from './schema.js'

export const invokeFooCommandBuilder = theServiceServiceBuilder
	.getCommandBuilder('invokeFoo', 'invokes foo command')
	.addPayloadSchema(theServiceV1InvokeFooInputPayloadSchema)
	.addParameterSchema(theServiceV1InvokeFooInputParameterSchema)
	.addOutputSchema(theServiceV1InvokeFooOutputPayloadSchema)
	.canInvoke(
		'TheService',
		'1',
		'foo',
		z.object({
			payload: z.any(),
			parameter: z.any(),
		}),
	)
	.setCommandFunction(async ({ service }, payload, parameter) => service.TheService['1'].foo(payload, parameter))
