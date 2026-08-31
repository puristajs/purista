import 'dotenv/config'

import { serve } from '@hono/node-server'
import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { apiReference } from '@scalar/hono-api-reference'

import { createOpenAiIncidentModel } from './model/createOpenAiIncidentModel.js'
import { IncidentRepository } from './resource/incidentRepository.js'
import { createAiExecution } from './runtime/createAiExecution.js'
import { supportV1Service } from './service/support/v1/index.js'

export const main = async () => {
	const logger = initLogger('debug')
	const model = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini'
	const eventBridge = new DefaultEventBridge()
	await eventBridge.start()
	const execution = createAiExecution()

	let supportService: Awaited<ReturnType<typeof supportV1Service.getInstance>>
	try {
		supportService = await supportV1Service.getInstance(eventBridge, {
			logger,
			resources: {
				incidentRepository: new IncidentRepository(),
				rollbackReviewRepository: execution.reviewRepository,
				harnessStorage: execution.ai.storage,
			},
			ai: {
				...execution.ai,
				models: {
					primary: {
						provider: createOpenAiIncidentModel(),
						model,
					},
				},
				telemetry: { contentCaptureMode: 'NO_CONTENT' },
				onSuspended: async notice => {
					const reviewId = notice.wait.waitId.replace(/^rollback-review:/, '')
					const review = await execution.reviewRepository.get(reviewId)
					if (!review) throw new Error('application_review_record_not_found')
					return { status: 'waiting' as const, reviewId }
				},
			},
		})
	} catch (error) {
		await execution.close()
		await eventBridge.destroy()
		throw error
	}
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
	honoService.app.get('/health/live', context => context.json({ status: 'ok' }))
	honoService.app.get('/health/ready', context => context.json({ status: 'ready' }))
	honoService.openApi.addServer({ url: 'http://localhost:3000', description: 'the local server' })

	await honoService.start()

	const serverInstance = serve({
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
			executionMode: execution.mode,
		},
		'PURISTA multi-agent incident response example started',
	)

	gracefulShutdown(logger, [
		{
			name: 'HTTP listener',
			destroy: () => new Promise<void>((resolve, reject) => serverInstance.close(error => (error ? reject(error) : resolve()))),
		},
		{ name: 'Hono service', destroy: () => honoService.destroy() },
		// Service destruction shuts the one shared Harness runtime down exactly once.
		{ name: 'Support service and shared Harness', destroy: () => supportService.destroy() },
		{ name: 'AI execution clients', destroy: () => execution.close() },
		{ name: 'Event bridge', destroy: () => eventBridge.destroy() },
	])
}

if (import.meta.url === `file://${process.argv[1]}`) {
	main()
}
