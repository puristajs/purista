import { HandledError, StatusCode } from '@purista/core'
import type { EndpointProtectMiddleware, HonoServiceClass } from '@purista/hono-http-server'

export const DEMO_API_KEY = 'demo-bank-key'

const demoCallers = new Map([
	[DEMO_API_KEY, { principalId: 'principal-alex', tenantId: 'tenant-example' }],
])

export const demoProtectMiddleware: EndpointProtectMiddleware<HonoServiceClass> = async function (c, next) {
	const authorization = c.req.header('authorization')
	const match = authorization?.match(/^Bearer\s+(.+)$/i)
	const caller = match ? demoCallers.get(match[1]) : undefined

	if (!caller) {
		throw new HandledError(StatusCode.Unauthorized, 'A valid demo API key is required')
	}

	c.set('principalId', caller.principalId)
	c.set('tenantId', caller.tenantId)
	await next()
}
