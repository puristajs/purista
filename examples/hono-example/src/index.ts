import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { apiReference } from '@scalar/hono-api-reference'

import { DefaultEventBridge, initLogger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { basicAuth } from 'hono/basic-auth'
import { compress } from 'hono/compress'

import { delayV1ServiceBuilder } from './service/delay/v1/index.js'
import { pingV1Service } from './service/ping/v1/index.js'

export const main = async () => {
	const logger = initLogger('debug')

	// initiate the event bridge as first step
	const eventBridge = new DefaultEventBridge()
	await eventBridge.start()

	// add your service
	const pingService = await pingV1Service.getInstance(eventBridge, {})
	await pingService.start()

	// initiate the webserver service as second step
	const honoService = await honoV1Service.getInstance(eventBridge, {
		logger,
		serviceConfig: { services: [pingService], enableDynamicRoutes: true },
	})

	honoService.app.use('*', compress())
	honoService.app.get(
		'/api',
		apiReference({
			spec: {
				url: '/api/openapi.json',
			},
		}),
	)

	honoService.app.get('*', serveStatic({ root: './public' }))
	honoService.openApi.addSecurityScheme('basicAuth', { type: 'http', scheme: 'basic' })
	honoService.openApi.addServer({ url: 'http://localhost:3000', description: 'the local server' })

	honoService
		.setHonoTypes<{ Variables: { customVar: string } }>()
		.setHealthFunction(async function () {
			this.logger.info('custom health check')
		})
		.setProtectMiddleware(async function (c, next) {
			const auth = basicAuth({ username: 'user', password: 'password' })
			c.set('additionalParameter', { userId: '123' })
			c.set('customVar', 'some custom var value')
			return auth(c, next)
		})

	// start the webserver
	await honoService.start()

	const _serverInstance = serve({
		fetch: honoService.app.fetch,
		port: 3000,
	})

	logger.info('Wait 10 secs until a new service starts')
	await new Promise(resolve => setTimeout(() => resolve(true), 10_000))

	const delayedService = await delayV1ServiceBuilder.getInstance(eventBridge, { logger })
	await delayedService.start()
}

main()
