import { serve } from '@hono/node-server'
import type { Logger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import type { ProcessRuntime } from './ProcessRuntime.js'

export async function createProcessHttpServer(
	logger: Logger,
	runtime: ProcessRuntime,
	port: number,
) {
	const http = await honoV1Service.getInstance(runtime.eventBridge, {
		logger,
		serviceConfig: {
			enableHealth: true,
			healthPath: '/health',
			openApi: {
				enabled: false,
				info: { title: 'Example Bank process health', version: '1.0.0' },
			},
		},
	})

	http.setHealthFunction(async () => {
		const state = await runtime.service.getServiceHealth()
		if (state.status !== 'ok') throw new Error(`${runtime.role} service is not healthy`)
	})
	await http.start()

	const server = serve({ fetch: http.app.fetch, hostname: '127.0.0.1', port })
	const listener = {
		name: `${runtime.role} nodeHttpListener`,
		destroy: () => new Promise<void>((resolve, reject) => {
			server.close(error => error ? reject(error) : resolve())
		}),
	}

	return { http, listener }
}
