import { serve } from '@hono/node-server'
import type { EventBridge, Logger, Service } from '@purista/core'
import { httpConfig } from './config/http.js'
import { createHttpService } from './httpApp.js'

/** Open the Node listener only after authentication and service routes are ready. */
export async function startHttpServer(input: { eventBridge: EventBridge; logger: Logger; services: Service[] }) {
	const honoService = await createHttpService(input)
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
