import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { createSupportService } from './createSupportService.js'

async function main() {
	const logger = initLogger()
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const support = await createSupportService(eventBridge, logger, {
		canResolve: async ({ tenantId, principalId }) => tenantId === 'tenant-example' && principalId === 'principal-alex',
	})
	await support.start()
	gracefulShutdown(logger, [support, eventBridge])
	logger.info('Durable support resolution service started')
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Support workflow service could not start.'}\n`)
	process.exit(1)
})
