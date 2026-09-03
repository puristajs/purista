import { identityV1ServiceBuilder } from '../../identityV1ServiceBuilder.js'
import { sessionStateKey } from '../../session.js'
import {
	identityV1LogoutInputParameterSchema,
	identityV1LogoutInputPayloadSchema,
	identityV1LogoutOutputPayloadSchema,
} from './schema.js'

export const logoutCommandBuilder = identityV1ServiceBuilder
	.getCommandBuilder('logout', 'Remove the current session')
	.addPayloadSchema(identityV1LogoutInputPayloadSchema)
	.addParameterSchema(identityV1LogoutInputParameterSchema)
	.addOutputSchema(identityV1LogoutOutputPayloadSchema)
	.exposeAsHttpEndpoint('DELETE', 'session')
	.setCommandFunction(async function (context, _payload, parameter) {
		await context.states.removeState(sessionStateKey(parameter.sessionToken))
		return { loggedOut: true as const }
	})
