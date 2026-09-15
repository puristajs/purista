import { z } from 'zod'
import { identityV1ServiceBuilder } from '../../identityV1ServiceBuilder.js'
import { readActiveSession, sessionRecordSchema } from '../../session.js'

export const resolveSessionCommandBuilder = identityV1ServiceBuilder
	.getCommandBuilder('resolveSession', 'Resolve one opaque session token')
	.addParameterSchema(z.strictObject({ sessionToken: z.uuid() }))
	.addOutputSchema(sessionRecordSchema)
	.setCommandFunction(async function (context, _payload, parameter) {
		return readActiveSession(context.states, parameter.sessionToken)
	})
