import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { swaggerUI } from '@hono/swagger-ui'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { type Service, gracefulShutdown, initLogger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { NatsBridge } from '@purista/natsbridge'
import { compress } from 'hono/compress'

import jaegerExporterOptions from './config/jaegerExporterOptions.js'
import natsBridgeConfig from './config/natsBridgeConfig.js'
import temporalConfig from './config/temporalConfig.js'
import { accountV1Service } from './service/account/v1/accountV1Service.js'
import { cardV1Service } from './service/card/v1/cardV1Service.js'
import { emailV1Service } from './service/email/v1/emailV1Service.js'
import { userV1Service } from './service/user/v1/userV1Service.js'

export const main = async () => {
	const logger = initLogger('debug')

	const exporter = new OTLPTraceExporter(jaegerExporterOptions)

	const spanProcessor = new SimpleSpanProcessor(exporter)

	const services: Service<any>[] = []

	// initiate the event bridge as first step
	const eventBridge = new NatsBridge({ ...natsBridgeConfig, logger, spanProcessor })
	await eventBridge.start()

	// start the services
	const userService = await userV1Service.getInstance(eventBridge, {
		logger,
		spanProcessor,
		serviceConfig: { ...temporalConfig },
	})
	await userService.start()
	services.push(userService)

	const emailService = await emailV1Service.getInstance(eventBridge, { logger, spanProcessor })
	await emailService.start()
	services.push(emailService)

	const accountService = await accountV1Service.getInstance(eventBridge, { logger, spanProcessor })
	await accountService.start()
	services.push(accountService)

	const cardService = await cardV1Service.getInstance(eventBridge, { logger, spanProcessor })
	await cardService.start()
	services.push(cardService)

	// initiate the webserver service as second step

	const port = 3000

	const honoService = await honoV1Service.getInstance(eventBridge, {
		logger,
		spanProcessor,
		serviceConfig: { services },
	})
	honoService.app.use(compress())
	honoService.app.get('/api', swaggerUI({ url: '/api/openapi.json' }))
	honoService.app.get('*', serveStatic({ root: './public' }))
	honoService.openApi.addServer({ url: `http://localhost:${port}`, description: 'the local server' })

	// start the webserver
	await honoService.start()

	const serverInstance = serve({
		fetch: honoService.app.fetch,
		port,
	})

	// add initiation and start of your services here
	// const yourService = await yourServiceBuilder.getInstance(eventBridge)
	// await yourService.start()
	// services.push(yourService)

	// try to shut down as clean as possible
	gracefulShutdown(logger, [
		honoService.prepareDestroy(),
		eventBridge,
		...services,
		{
			name: `${honoService.serviceInfo.serviceName} ${honoService.serviceInfo.serviceVersion} close socket`,
			destroy: async () => {
				serverInstance.close()
			},
		},
		honoService,
	])
}

main()
