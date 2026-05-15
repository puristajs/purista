import { serve } from '@hono/node-server'
import { DefaultEventBridge, initLogger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { apiReference } from '@scalar/hono-api-reference'

import { createSupportTriageModel } from './model/createSupportTriageModel.js'
import { supportV1Service } from './service/support/v1/index.js'

export const main = async () => {
	const logger = initLogger('debug')
	const eventBridge = new DefaultEventBridge()
	await eventBridge.start()

	const supportService = await supportV1Service.getInstance(eventBridge, {
		logger,
		ai: {
			models: {
				primary: {
					provider: createSupportTriageModel(),
					model: 'support-triage',
					capabilities: ['object'],
				},
			},
		},
	})
	await supportService.start()

	const honoService = await honoV1Service.getInstance(eventBridge, {
		logger,
		serviceConfig: {
			services: [supportService],
			enableDynamicRoutes: true,
			openApi: { enabled: true, info: {} },
		},
	})

	honoService.app.get(
		'/api',
		apiReference({
			spec: {
				url: '/api/openapi.json',
			},
		}),
	)
	honoService.openApi.addServer({ url: 'http://localhost:3000', description: 'the local server' })

	await honoService.start()

	const _serverInstance = serve({
		fetch: honoService.app.fetch,
		port: 3000,
	})

	const definitions = await supportV1Service.resolveDefinitions()
	logger.info(
		{
			service: supportV1Service.info.serviceName,
			agent: 'triageTicket',
			queue: definitions.queues[0]?.queueName,
			command: definitions.commands[0]?.commandName,
			stream: definitions.streams[0]?.streamName,
			openApi: 'http://localhost:3000/api',
		},
		'PURISTA agent example started',
	)
}

if (import.meta.url === `file://${process.argv[1]}`) {
	main()
}
