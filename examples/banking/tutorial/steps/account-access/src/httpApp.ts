import type { EventBridge, Logger, Service } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { httpConfig } from './config/http.js'
import { isFixtureActor } from './identity.js'
import { LocalSessions, sessionCookieName, sessionLifetimeSeconds } from './localSessions.js'

/** Configure the same HTTP/authentication boundary for the app and its tests. */
export async function createHttpService(input: {
	eventBridge: EventBridge
	logger: Logger
	services: Service[]
	sessions?: LocalSessions
}) {
	const sessions = input.sessions ?? new LocalSessions()
	const http = await honoV1Service.getInstance(input.eventBridge, {
		logger: input.logger,
		serviceConfig: httpConfig.serviceConfig,
	})
	const cookieOptions = '; HttpOnly; Path=/; SameSite=Strict'
	const allowedOrigins = new Set([`http://127.0.0.1:${httpConfig.port}`, `http://localhost:${httpConfig.port}`])
	const allowedOrigin = (origin: string | undefined) => !origin || allowedOrigins.has(origin)

	http.app.post('/auth/login', async context => {
		if (!allowedOrigin(context.req.header('origin'))) return context.json({ title: 'Cross-site request denied' }, 403)
		if (!context.req.header('content-type')?.startsWith('application/json')) {
			return context.json({ title: 'Use application/json' }, 415)
		}
		const body = await context.req.json<{ actor?: unknown }>().catch(() => undefined)
		if (!isFixtureActor(body?.actor)) return context.json({ title: 'Choose a known fixture actor' }, 400)
		const sessionId = sessions.create(body.actor)
		context.header('set-cookie', `${sessionCookieName}=${sessionId}${cookieOptions}; Max-Age=${sessionLifetimeSeconds}`)
		return context.json({ signedIn: true })
	})

	http.app.post('/auth/logout', context => {
		if (!allowedOrigin(context.req.header('origin'))) return context.json({ title: 'Cross-site request denied' }, 403)
		sessions.delete(context.req.header('cookie'))
		context.header('set-cookie', `${sessionCookieName}=${cookieOptions}; Max-Age=0`)
		return context.json({ signedIn: false })
	})

	http.setProtectMiddleware(async (context, next) => {
		if (!allowedOrigin(context.req.header('origin'))) return context.json({ title: 'Cross-site request denied' }, 403)
		const identity = sessions.find(context.req.header('cookie'))
		if (!identity) return context.json({ title: 'A local session is required' }, 401)
		context.set('tenantId', identity.tenantId)
		context.set('principalId', identity.principalId)
		await next()
	})

	http.registerService(...input.services)
	await http.start()
	return http
}
