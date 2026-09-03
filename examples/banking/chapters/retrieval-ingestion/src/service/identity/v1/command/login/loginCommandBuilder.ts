import { randomUUID } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'
import { identityV1ServiceBuilder } from '../../identityV1ServiceBuilder.js'
import { sessionStateKey } from '../../session.js'

const inputSchema = z.strictObject({ username: z.string().min(1), password: z.string().min(1) })
const outputSchema = z.strictObject({
	sessionToken: z.uuid(),
	displayName: z.string(),
	expiresAt: z.number().int().positive(),
})

export const loginCommandBuilder = identityV1ServiceBuilder
	.getCommandBuilder('login', 'Create a local tutorial session')
	.addPayloadSchema(inputSchema)
	.addOutputSchema(outputSchema)
	.exposeAsHttpEndpoint('POST', 'session/login')
	.makeEndpointPublic()
	.setCommandFunction(async function (context, payload) {
		if (payload.username !== 'alex@example.test' || payload.password !== 'demo-password') {
			throw new HandledError(StatusCode.Unauthorized, 'Invalid local credentials')
		}
		const sessionToken = randomUUID()
		const displayName = 'Alex Example'
		const expiresAt = Date.now() + this.config.sessionTtlMs
		await context.states.setState(sessionStateKey(sessionToken), {
			principalId: 'principal-alex',
			tenantId: 'tenant-example',
			displayName,
			expiresAt,
		})
		return { sessionToken, displayName, expiresAt }
	})
