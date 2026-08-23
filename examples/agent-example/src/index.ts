import 'dotenv/config'

import { serve } from '@hono/node-server'
import { DefaultEventBridge, initLogger } from '@purista/core'
import { inMemorySandbox } from '@purista/harness'
import { honoV1Service } from '@purista/hono-http-server'
import { apiReference } from '@scalar/hono-api-reference'

import { createOpenAiIncidentModel } from './model/createOpenAiIncidentModel.js'
import { IncidentRepository } from './resource/incidentRepository.js'
import { supportV1Service } from './service/support/v1/index.js'

export const main = async () => {
	const logger = initLogger('debug')
	const model = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini'
	const eventBridge = new DefaultEventBridge()
	await eventBridge.start()

	const supportService = await supportV1Service.getInstance(eventBridge, {
		logger,
		resources: {
			incidentRepository: new IncidentRepository(),
		},
		ai: {
			models: {
				primary: {
					provider: createOpenAiIncidentModel(),
					model,
					capabilities: ['object'],
				},
			},
			// This example deliberately uses an ephemeral sandbox. Production code
			// must supply an adapter that declares and enforces its own capabilities.
			sandbox: inMemorySandbox(),
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
			agents: definitions.queues.map(queue => queue.queueName),
			commands: definitions.commands.map(command => command.commandName),
			openApi: 'http://localhost:3000/api',
		},
		'PURISTA multi-agent incident response example started',
	)
}

if (import.meta.url === `file://${process.argv[1]}`) {
	main()
}
