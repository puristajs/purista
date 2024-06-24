import { ServiceEvent } from '../../../../ServiceEvent.enum.js'
import { theServiceServiceBuilder } from '../../theServiceServiceBuilder.js'
import {
	theServiceV1PingInputParameterSchema,
	theServiceV1PingInputPayloadSchema,
	theServiceV1PingOutputPayloadSchema,
} from './schema.js'

export const pingCommandBuilder = theServiceServiceBuilder
	.getCommandBuilder('ping', 'provide a dummy command')
	.setSuccessEventName(ServiceEvent.Pinged)
	.addPayloadSchema(theServiceV1PingInputPayloadSchema)
	.addParameterSchema(theServiceV1PingInputParameterSchema)
	.addOutputSchema(theServiceV1PingOutputPayloadSchema)
	.exposeAsHttpEndpoint('GET', 'ping')
	.setCommandFunction(async function (_context, _payload, _parameter) {
		return {
			ping: true,
		}
	})
