import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import type { SpanProcessor } from '@opentelemetry/sdk-trace-base'
import { AmqpBridge } from '@purista/amqpbridge'
import { DefaultConfigStore, DefaultSecretStore, gracefulShutdown, initLogger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { RedisStateStore } from '@purista/redis-state-store'

import httpServerConfig from './config/httpServerConfig.js'
import { emailV1Service } from './service/email/v1/emailV1Service.js'
import { userV1Service } from './service/user/v1/userV1Service.js'

export const main = async (getProcessor: () => SpanProcessor) => {
	// initialize the logging
	const logger = initLogger()

	logger.info('application starts')

	const spanProcessor = getProcessor()

	// create and init our eventbridge
	const eventBridge = new AmqpBridge({
		spanProcessor,
	})
	await eventBridge.start()

	// create and init a webserver
	const honoService = await honoV1Service.getInstance(eventBridge, {
		serviceConfig: httpServerConfig,
		spanProcessor,
	})

	honoService.app.get('*', serveStatic({ root: './public' }))

	// start the webserver
	await honoService.start()

	const _serverInstance = serve({
		fetch: honoService.app.fetch,
		port: httpServerConfig.port,
	})

	// create a state store
	const stateStore = new RedisStateStore({ config: { url: 'redis://localhost:6379' } })
	// create config store
	const configStore = new DefaultConfigStore({
		config: {
			emailProviderUrl: 'https://example.com',
		},
	})
	// create secret store
	const secretStore = new DefaultSecretStore({
		config: {
			emailProviderAuthToken: 'some-secret-token',
		},
	})

	const userService = await userV1Service.getInstance(eventBridge, {
		spanProcessor,
		stateStore,
		configStore,
		secretStore,
	})
	await userService.start()

	const emailService = await emailV1Service.getInstance(eventBridge, {
		spanProcessor,
		stateStore,
		configStore,
		secretStore,
	})
	await emailService.start()

	logger.info('application ready')
	logger.info(`open in browser: http://localhost:${httpServerConfig.port}`)

	gracefulShutdown(logger, [
		// begin with the event bridge to no longer accept incoming messages
		eventBridge,
		userService,
		emailService,
		honoService,
		secretStore,
		stateStore,
		configStore,
		{
			name: 'OTSpanProcessor',
			destroy: () => spanProcessor.shutdown(),
		},
	])
}
