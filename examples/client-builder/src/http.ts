import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import type { EventBridge, Logger, Service } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { apiReference } from '@scalar/hono-api-reference'
import httpConfig from './config/http.js'

export const getHttpServer = async (input: {
	eventBridge: EventBridge
	logger: Logger
	services: Service[]
}) => {
	const honoService = await honoV1Service.getInstance(input.eventBridge, {
		logger: input.logger,
		serviceConfig: { ...httpConfig.serviceConfig, services: input.services },
	})

	// provide the OpenAPI UI
	honoService.app.get(
		httpConfig.serviceConfig.apiMountPath,
		apiReference({
			pageTitle: httpConfig.serviceConfig.openApi.info.title,
			spec: {
				url: `${httpConfig.serviceConfig.apiMountPath}/openapi.json`,
			},
		}),
	)

	// provide static files from public directory
	honoService.app.get('*', serveStatic({ root: httpConfig.root }))

	// add a server to the OpenAPI spec for local development purposes.
	// This is useful when you want to test your API locally without deploying it to a production environment.
	honoService.openApi.addServer({ url: `http://localhost:${httpConfig.port}`, description: 'the local server' })

	// start the webserver service
	await honoService.start()

	// start listening on given port - use hono node.js adapter
	const serverInstance = serve({
		fetch: honoService.app.fetch,
		port: httpConfig.port,
	})

	return { honoService, serverInstance }
}
