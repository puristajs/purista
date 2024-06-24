import { theServiceServiceBuilder } from '../../theServiceServiceBuilder.js'
import {
	theServiceV1FooInputParameterSchema,
	theServiceV1FooInputPayloadSchema,
	theServiceV1FooOutputPayloadSchema,
} from './schema.js'

export const fooCommandBuilder = theServiceServiceBuilder
	.getCommandBuilder('foo', 'provide a dummy command')
	.addPayloadSchema(theServiceV1FooInputPayloadSchema)
	.addParameterSchema(theServiceV1FooInputParameterSchema)
	.addOutputSchema(theServiceV1FooOutputPayloadSchema)
	.setCommandFunction(async function (_context, payload, parameter) {
		return {
			payload,
			parameter,
		}
	})
