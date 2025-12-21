import { ServiceEvent } from '../../../../serviceEvent.enum.js'
import { pingPongV1ServiceBuilder } from '../../pingPongV1ServiceBuilder.js'
import {
	pingPongV1PingInputParameterSchema,
	pingPongV1PingInputPayloadSchema,
	pingPongV1PingOutputPayloadSchema,
} from './schema.js'

export const pingCommandBuilder = pingPongV1ServiceBuilder
	.getCommandBuilder('ping', 'send a ping')
	.setSuccessEventName(ServiceEvent.Pinged)
	.addPayloadSchema(pingPongV1PingInputPayloadSchema)
	.addParameterSchema(pingPongV1PingInputParameterSchema)
	.addOutputSchema(pingPongV1PingOutputPayloadSchema)
	.exposeAsHttpEndpoint('GET', 'ping')
	.makeEndpointPublic()
	// biome-ignore lint/complexity/useArrowFunction: service command functions rely on dynamic `this` binding.
	.setCommandFunction(async function (context, payload, parameter) {
		void context
		void payload
		void parameter
		return 'PING!'
	})
