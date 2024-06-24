import { theServiceServiceBuilder } from '../../theServiceServiceBuilder.js'
import {
	theServiceV1PutInputParameterSchema,
	theServiceV1PutInputPayloadSchema,
	theServiceV1PutOutputPayloadSchema,
} from './schema.js'

export const putCommandBuilder = theServiceServiceBuilder
	.getCommandBuilder('put', 'provide a dummy command')
	.addPayloadSchema(theServiceV1PutInputPayloadSchema)
	.addParameterSchema(theServiceV1PutInputParameterSchema)
	.addOutputSchema(theServiceV1PutOutputPayloadSchema)
	.exposeAsHttpEndpoint('PUT', 'put')
	.setCommandFunction(async function (_context, payload, _parameter) {
		return {
			payload,
		}
	})
