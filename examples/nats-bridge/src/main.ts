import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { gracefulShutdown, initLogger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { NatsStateStore } from '@purista/nats-state-store'
import { NatsBridge } from '@purista/natsbridge'

import httpServerConfig from './config/httpServerConfig.js'
import { emailV1Service } from './service/email/v1/emailV1Service.js'
import { userV1Service } from './service/user/v1/userV1Service.js'

export const main = async () => {
	// initialize the logging
	const logger = initLogger('debug')

	logger.info('application starts')

	// create and init our eventbridge
	const eventBridge = new NatsBridge({ logger })
	await eventBridge.start()

	// create a state store
	const stateStore = new NatsStateStore({ logger })

	// create and init a webserver
	const honoService = await honoV1Service.getInstance(eventBridge, {
		serviceConfig: httpServerConfig,
	})

	honoService.app.get('*', serveStatic({ root: './public' }))

	// start the webserver
	await honoService.start()

	const _serverInstance = serve({
		fetch: honoService.app.fetch,
		port: httpServerConfig.port,
	})

	const userService = await userV1Service.getInstance(eventBridge, { logger, stateStore })
	await userService.start()

	const emailService = await emailV1Service.getInstance(eventBridge, { logger, stateStore })
	await emailService.start()

	logger.info('application ready')
	logger.info(`open in browser: http://localhost:${httpServerConfig.port}`)

	gracefulShutdown(logger, [
		// begin with the event bridge to no longer accept incoming messages
		eventBridge,
		userService,
		emailService,
		stateStore,
		honoService,
	])
}
