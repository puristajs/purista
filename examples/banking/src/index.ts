import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'

import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import {
	DefaultEventBridge,
	DefaultQueueBridge,
	gracefulShutdown,
	initLogger,
	type PuristaMetricsRecorderInterface,
} from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'

import { BankingOperationsStore } from './advanced/repository.js'
import { bankingOperationsService } from './advanced/service.js'
import type { BankActor } from './repository.js'
import { BankingRepository } from './repository.js'
import { bankingService } from './service.js'

const tutorialUiDirectory = fileURLToPath(new URL('../ui/dist', import.meta.url))
const sessionCookieName = 'example_bank_session'
const localTenantId = 'tenant-north' as const
const fixtureActors = ['alice', 'bob', 'carol', 'dana', 'erin'] as const satisfies readonly BankActor[]

type LocalSession = {
	principalId: BankActor
	tenantId: typeof localTenantId
}

const isFixtureActor = (value: unknown): value is BankActor =>
	typeof value === 'string' && fixtureActors.includes(value as BankActor)

const readCookie = (cookieHeader: string | undefined, name: string) => {
	if (!cookieHeader) return undefined
	for (const part of cookieHeader.split(';')) {
		const [key, ...value] = part.trim().split('=')
		if (key === name) return value.join('=')
	}
	return undefined
}

const sessionCookie = (sessionId: string) =>
	`${sessionCookieName}=${encodeURIComponent(sessionId)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600`

const expiredSessionCookie = `${sessionCookieName}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`

export type BankingApplicationOptions = {
	/** Injects a deterministic repository for a focused runtime test. */
	bankingRepository?: BankingRepository
	/** Captures safe framework and application metrics in a focused runtime test. */
	metricsRecorder?: PuristaMetricsRecorderInterface
}

export const createBankingApplication = async (options: BankingApplicationOptions = {}) => {
	const eventBridge = new DefaultEventBridge()
	const queueBridge = new DefaultQueueBridge()
	const bankingRepository = options.bankingRepository ?? new BankingRepository()
	const operationsStore = new BankingOperationsStore()
	const sessions = new Map<string, LocalSession>()
	await eventBridge.start()
	await queueBridge.start()
	const banking = await bankingService.getInstance(eventBridge, {
		resources: { bankingRepository },
		metricsRecorder: options.metricsRecorder,
	})
	const bankingOperations = await bankingOperationsService.getInstance(eventBridge, {
		queueBridge,
		resources: { bankingRepository, operationsStore },
		metricsRecorder: options.metricsRecorder,
	})
	await banking.start()
	await bankingOperations.start()

	const hono = await honoV1Service.getInstance(eventBridge, {
		serviceConfig: { services: [banking, bankingOperations], autoRegisterServicesFromConfig: true },
	})
	const findSession = (cookieHeader: string | undefined) => {
		const sessionId = readCookie(cookieHeader, sessionCookieName)
		return sessionId ? sessions.get(sessionId) : undefined
	}

	/**
	 * A local-only fixture login. The browser chooses a documented fixture person,
	 * then receives an opaque HttpOnly session. Protected routes trust only the
	 * server-side session record, never a browser-provided principal header.
	 */
	hono.app.post('/auth/login', async context => {
		const body = await context.req.json<{ actor?: unknown }>().catch(() => undefined)
		if (!isFixtureActor(body?.actor)) return context.json({ title: 'Choose a known tutorial actor' }, 400)

		const sessionId = randomUUID()
		const session = { principalId: body.actor, tenantId: localTenantId } as const
		sessions.set(sessionId, session)
		context.header('set-cookie', sessionCookie(sessionId))
		return context.json(session)
	})
	hono.app.post('/auth/logout', context => {
		const sessionId = readCookie(context.req.header('cookie'), sessionCookieName)
		if (sessionId) sessions.delete(sessionId)
		context.header('set-cookie', expiredSessionCookie)
		return context.body(null, 204)
	})
	hono.app.get('/auth/whoami', context => {
		const session = findSession(context.req.header('cookie'))
		if (!session) return context.json({ title: 'A local session is required' }, 401)
		return context.json(session)
	})
	hono.setProtectMiddleware(async function (context, next) {
		const session = findSession(context.req.header('cookie'))
		if (!session) return context.json({ title: 'A local session is required' }, 401)
		context.set('principalId', session.principalId)
		context.set('tenantId', session.tenantId)
		return next()
	})
	// The tutorial UI is intentionally public. Generated PURISTA endpoints are
	// protected by the server-validated local session middleware above.
	hono.app.get('/assets/*', serveStatic({ root: tutorialUiDirectory }))
	hono.app.get('/favicon.svg', serveStatic({ root: tutorialUiDirectory }))
	hono.app.get('/', serveStatic({ root: tutorialUiDirectory, path: 'index.html' }))
	await hono.start()
	return {
		fetch: hono.app.fetch,
		destroy: async () => {
			await hono.destroy()
			await bankingOperations.destroy()
			await banking.destroy()
			await queueBridge.destroy()
			await eventBridge.destroy()
		},
	}
}

export const main = async () => {
	const logger = initLogger('info')
	const application = await createBankingApplication()
	const listener = serve({ fetch: application.fetch, port: Number(process.env.PORT ?? 3010) })

	gracefulShutdown(logger, [
		{
			name: 'Example Bank HTTP listener',
			destroy: () =>
				new Promise<void>((resolve, reject) => listener.close(error => (error ? reject(error) : resolve()))),
		},
		{ name: 'Example Bank application', destroy: () => application.destroy() },
	])
}

if (import.meta.url === `file://${process.argv[1]}`) main()
