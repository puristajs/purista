import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { createReviewApplication } from './createReviewApplication.js'

async function main() {
	const logger = initLogger()
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const { support, transaction } = await createReviewApplication(
		eventBridge,
		logger,
		{
			canRequest: async ({ tenantId, principalId }) =>
				tenantId === 'tenant-example' && principalId === 'principal-alex',
			canReview: async ({ tenantId, principalId }) =>
				tenantId === 'tenant-example' && principalId === 'principal-reviewer',
		},
		{
			freeze: async ({ cardId }) => ({ status: 'frozen', cardId }),
		},
	)
	gracefulShutdown(logger, [support, transaction, eventBridge])
	logger.info('Human review workflow services started')
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Human review services could not start.'}\n`)
	process.exit(1)
})
