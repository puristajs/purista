import { HandledError, StatusCode } from '@purista/core'
import type { EndpointProtectMiddleware, HonoServiceClass } from '@purista/hono-http-server'
import type { SessionRecord } from './service/identity/v1/session.js'

export const createSessionProtectMiddleware = (http: HonoServiceClass): EndpointProtectMiddleware<HonoServiceClass> =>
	async function (context, next) {
		const authorization = context.req.header('authorization')
		const sessionToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
		if (!sessionToken) throw new HandledError(StatusCode.Unauthorized, 'A session bearer token is required')

		try {
			const session = (await http.invoke(
				{
					receiver: { serviceName: 'Identity', serviceVersion: '1', serviceTarget: 'resolveSession' },
					payload: { payload: undefined, parameter: { sessionToken } },
					contentType: 'application/json',
					contentEncoding: 'utf-8',
				},
				'protect-session',
			)) as SessionRecord
			context.set('principalId', session.principalId)
			context.set('tenantId', session.tenantId)
			context.set('additionalParameter', { sessionToken })
			await next()
		} catch {
			throw new HandledError(StatusCode.Unauthorized, 'The session is invalid or expired')
		}
	}
