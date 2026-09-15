import { identityV1ServiceBuilder } from '../../identityV1ServiceBuilder.js'
import { readActiveSession } from '../../session.js'
import {
	identityV1ResolveSessionInputParameterSchema,
	identityV1ResolveSessionInputPayloadSchema,
	identityV1ResolveSessionOutputPayloadSchema,
} from './schema.js'

export const resolveSessionCommandBuilder = identityV1ServiceBuilder
	.getCommandBuilder('resolveSession', 'Resolve an opaque session token')
	.addPayloadSchema(identityV1ResolveSessionInputPayloadSchema)
	.addParameterSchema(identityV1ResolveSessionInputParameterSchema)
	.addOutputSchema(identityV1ResolveSessionOutputPayloadSchema)
	.setCommandFunction(async function (context, _payload, parameter) {
		return readActiveSession(context.states, parameter.sessionToken)
	})
