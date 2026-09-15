import { pingV1ServiceBuilder } from '../../pingV1ServiceBuilder.js'
import{
	pingV1PingInputParameterSchema,
	pingV1PingInputPayloadSchema,
	pingV1PingOutputPayloadSchema,
} from './schema.js'

export const pingCommandBuilder = pingV1ServiceBuilder
	.getCommandBuilder('ping','Ping through the default blueprint')
	.addPayloadSchema(pingV1PingInputPayloadSchema)
	.addParameterSchema(pingV1PingInputParameterSchema)
	.addOutputSchema(pingV1PingOutputPayloadSchema)
	// biome-ignore lint/complexity/useArrowFunction: use function as the this-context contains the service
	.setCommandFunction(async function (_context, _payload, _parameter){
		// implementation of the command ping goes here
	})