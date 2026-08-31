import { serve } from '@hono/node-server'
import { DefaultEventBridge, DefaultQueueBridge, gracefulShutdown, initLogger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'

import { BankingOperationsStore } from './advanced/repository.js'
import { bankingOperationsService } from './advanced/service.js'
import { BankingRepository } from './repository.js'
import { bankingService } from './service.js'

export type BankingApplicationOptions = {
	/** Injects a deterministic repository for a focused runtime test. */
	bankingRepository?: BankingRepository
}

export const createBankingApplication = async (options: BankingApplicationOptions = {}) => {
	const eventBridge = new DefaultEventBridge()
	const queueBridge = new DefaultQueueBridge()
	const bankingRepository = options.bankingRepository ?? new BankingRepository()
	const operationsStore = new BankingOperationsStore()
	await eventBridge.start()
	await queueBridge.start()
	const banking = await bankingService.getInstance(eventBridge, { resources: { bankingRepository } })
	const bankingOperations = await bankingOperationsService.getInstance(eventBridge, {
		queueBridge,
		resources: { bankingRepository, operationsStore },
	})
	await banking.start()
	await bankingOperations.start()

	const hono = await honoV1Service.getInstance(eventBridge, {
		serviceConfig: { services: [banking, bankingOperations], autoRegisterServicesFromConfig: true },
	})
	hono.setProtectMiddleware(async function (context, next) {
		const actor = context.req.header('x-example-actor') ?? 'alice'
		if (!['alice', 'bob', 'carol', 'dana'].includes(actor)) return context.json({ title: 'Unknown example actor' }, 401)
		context.set('principalId', actor)
		context.set('tenantId', 'tenant-north')
		return next()
	})
	hono.app.get('/', context =>
		context.html(
			'<!doctype html><title>Example Bank</title><main><h1>Example Bank</h1><p>Use the tutorial UI checkpoint to explore this service.</p></main>',
		),
	)
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
