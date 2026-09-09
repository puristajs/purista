import { HandledError, StatusCode } from '@purista/core'
import type { EndpointProtectMiddleware, HonoServiceClass } from '@purista/hono-http-server'
import type { SessionRecord } from './service/identity/v1/session.js'

export const createSessionProtectMiddleware = (
	http: HonoServiceClass,
): EndpointProtectMiddleware<HonoServiceClass> => async function (c, next) {
	const authorization = c.req.header('authorization')
	const match = authorization?.match(/^Bearer\s+(.+)$/i)
	const sessionToken = match?.[1]
	if (!sessionToken) {
		throw new HandledError(StatusCode.Unauthorized, 'A session bearer token is required')
	}

	let session: SessionRecord
	try {
		session = await http.invoke({
			receiver: { serviceName: 'Identity', serviceVersion: '1', serviceTarget: 'resolveSession' },
			payload: { payload: undefined, parameter: { sessionToken } },
			contentType: 'application/json',
			contentEncoding: 'utf-8',
		}, 'protect-session') as SessionRecord
	} catch {
		throw new HandledError(StatusCode.Unauthorized, 'The session is invalid or expired')
	}

	c.set('principalId', session.principalId)
	c.set('tenantId', session.tenantId)
	c.set('additionalParameter', { sessionToken })
	await next()
}
