import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { createAnalysisService } from './createAnalysisService.js'

async function main() {
	const logger = initLogger()
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const { service: servicePromise } = createAnalysisService(eventBridge, logger, {
		canRun: async ({ tenantId, principalId }) => tenantId === 'tenant-example' && principalId === 'principal-analyst',
	})
	const service = await servicePromise
	await service.start()
	gracefulShutdown(logger, [service, eventBridge])
	logger.info('Sandbox transaction analysis service started')
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Sandbox analysis service could not start.'}\n`)
	process.exit(1)
})
