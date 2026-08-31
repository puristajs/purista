import { serve } from '@hono/node-server'
import type { EventBridge, Logger, Service } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { httpConfig } from './config/http.js'

/** Register the application's services before accepting HTTP requests. */
export async function startHttpServer(input: { eventBridge: EventBridge; logger: Logger; services: Service[] }) {
	const honoService = await honoV1Service.getInstance(input.eventBridge, {
		logger: input.logger,
		serviceConfig: httpConfig.serviceConfig,
	})
	honoService.registerService(...input.services)
	await honoService.start()

	const server = serve({
		fetch: honoService.app.fetch,
		hostname: httpConfig.hostname,
		port: httpConfig.port,
	})

	const closeSocket = {
		name: 'Example Bank HTTP socket',
		destroy: () =>
			new Promise<void>((resolve, reject) => {
				server.close(error => (error ? reject(error) : resolve()))
			}),
	}

	return { honoService, closeSocket }
}
