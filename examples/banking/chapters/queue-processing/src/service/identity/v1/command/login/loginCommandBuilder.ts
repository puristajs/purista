import { randomUUID } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import { identityV1ServiceBuilder } from '../../identityV1ServiceBuilder.js'
import { sessionStateKey } from '../../session.js'
import {
	identityV1LoginInputParameterSchema,
	identityV1LoginInputPayloadSchema,
	identityV1LoginOutputPayloadSchema,
} from './schema.js'

export const loginCommandBuilder = identityV1ServiceBuilder
	.getCommandBuilder('login', 'Create a local session')
	.addPayloadSchema(identityV1LoginInputPayloadSchema)
	.addParameterSchema(identityV1LoginInputParameterSchema)
	.addOutputSchema(identityV1LoginOutputPayloadSchema)
	.exposeAsHttpEndpoint('POST', 'session/login')
	.makeEndpointPublic()
	.setCommandFunction(async function (context, payload) {
		const identity = await context.resources.identityProvider.authenticate(payload.username, payload.password)
		if (!identity) throw new HandledError(StatusCode.Unauthorized, 'Invalid local credentials')

		const sessionToken = randomUUID()
		const expiresAt = Date.now() + this.config.sessionTtlMs
		await context.states.setState(sessionStateKey(sessionToken), { ...identity, expiresAt })
		return { sessionToken, displayName: identity.displayName, expiresAt }
	})
