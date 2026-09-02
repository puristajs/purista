import type { EndpointProtectMiddleware, HonoServiceClass } from '@purista/hono-http-server'
import type { SessionRecord } from './service/identity/v1/session.js'

function unauthorized(c: Parameters<EndpointProtectMiddleware<HonoServiceClass>>[0], detail: string) {
	c.header('content-type', 'application/problem+json; charset=utf-8')
	return c.json({
		type: 'about:blank',
		title: 'Unauthorized',
		status: 401,
		detail,
		instance: c.req.path,
	}, 401)
}

export const createSessionProtectMiddleware = (
	http: HonoServiceClass,
): EndpointProtectMiddleware<HonoServiceClass> => async function (c, next) {
	const authorization = c.req.header('authorization')
	const match = authorization?.match(/^Bearer\s+(.+)$/i)
	const sessionToken = match?.[1]
	if (!sessionToken) return unauthorized(c, 'A session bearer token is required')

	try {
		const session = await http.invoke({
			receiver: { serviceName: 'Identity', serviceVersion: '1', serviceTarget: 'resolveSession' },
			payload: { payload: undefined, parameter: { sessionToken } },
			contentType: 'application/json',
			contentEncoding: 'utf-8',
		}, 'protect-session') as SessionRecord

		c.set('principalId', session.principalId)
		c.set('tenantId', session.tenantId)
		c.set('additionalParameter', { sessionToken })
		await next()
	} catch {
		return unauthorized(c, 'The session is invalid or expired')
	}
}
