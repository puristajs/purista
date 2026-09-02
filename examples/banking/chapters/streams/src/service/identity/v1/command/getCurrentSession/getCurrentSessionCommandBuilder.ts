import { identityV1ServiceBuilder } from '../../identityV1ServiceBuilder.js'
import { readActiveSession } from '../../session.js'
import {
	identityV1GetCurrentSessionInputParameterSchema,
	identityV1GetCurrentSessionInputPayloadSchema,
	identityV1GetCurrentSessionOutputPayloadSchema,
} from './schema.js'

export const getCurrentSessionCommandBuilder = identityV1ServiceBuilder
	.getCommandBuilder('getCurrentSession', 'Read the current session')
	.addPayloadSchema(identityV1GetCurrentSessionInputPayloadSchema)
	.addParameterSchema(identityV1GetCurrentSessionInputParameterSchema)
	.addOutputSchema(identityV1GetCurrentSessionOutputPayloadSchema)
	.exposeAsHttpEndpoint('GET', 'session')
	.setCommandFunction(async function (context, _payload, parameter) {
		return readActiveSession(context.states, parameter.sessionToken)
	})
