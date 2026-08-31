import { serve } from '@hono/node-server'
import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'

import { BankingRepository } from './repository.js'
import { bankingService } from './service.js'

export const createBankingApplication = async () => {
	const logger = initLogger('info')
	const eventBridge = new DefaultEventBridge()
	await eventBridge.start()
	const banking = await bankingService.getInstance(eventBridge, { resources: { bankingRepository: new BankingRepository() } })
	await banking.start()

	const hono = await honoV1Service.getInstance(eventBridge, {
		serviceConfig: { services: [banking], autoRegisterServicesFromConfig: true },
	})
	hono.setProtectMiddleware(async function (context, next) {
		const actor = context.req.header('x-example-actor') ?? 'alice'
		if (!['alice', 'bob', 'carol', 'dana'].includes(actor)) return context.json({ title: 'Unknown example actor' }, 401)
		context.set('principalId', actor)
		context.set('tenantId', 'tenant-north')
		return next()
	})
	hono.app.get('/', context =>
		context.html('<!doctype html><title>Example Bank</title><main><h1>Example Bank</h1><p>Use the tutorial UI checkpoint to explore this service.</p></main>'),
	)
	await hono.start()
	return {
		fetch: hono.app.fetch,
		destroy: async () => {
			await hono.destroy()
			await banking.destroy()
			await eventBridge.destroy()
		},
	}
}

export const main = async () => {
	const logger = initLogger('info')
	const application = await createBankingApplication()
	const listener = serve({ fetch: application.fetch, port: Number(process.env.PORT ?? 3010) })

	gracefulShutdown(logger, [
		{ name: 'Example Bank HTTP listener', destroy: () => new Promise<void>((resolve, reject) => listener.close(error => (error ? reject(error) : resolve()))) },
		{ name: 'Example Bank application', destroy: () => application.destroy() },
	])
}

if (import.meta.url === `file://${process.argv[1]}`) main()
