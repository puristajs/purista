import { ServiceEvent } from '../../../../serviceEvent.enum.js'
import { pingPongV1ServiceBuilder } from '../../pingPongV1ServiceBuilder.js'
import {
	pingPongV1PongInputParameterSchema,
	pingPongV1PongInputPayloadSchema,
	pingPongV1PongOutputPayloadSchema,
} from './schema.js'

export const pongCommandBuilder = pingPongV1ServiceBuilder
	.getCommandBuilder('pong', 'a pong')
	.setSuccessEventName(ServiceEvent.Ponged)
	.addPayloadSchema(pingPongV1PongInputPayloadSchema)
	.addParameterSchema(pingPongV1PongInputParameterSchema)
	.addOutputSchema(pingPongV1PongOutputPayloadSchema)
	// biome-ignore lint/complexity/useArrowFunction: service command functions rely on dynamic `this` binding.
	.setCommandFunction(async function (context, payload, parameter) {
		void context
		void parameter
		return `${payload.pongMessage} -> PONG!`
	})
