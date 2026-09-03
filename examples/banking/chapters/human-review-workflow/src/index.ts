import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { createReviewApplication } from './createReviewApplication.js'

async function main() {
	const logger = initLogger()
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const application = await createReviewApplication(
		eventBridge,
		logger,
		{
			canRequest: async ({ tenantId, principalId }) =>
				tenantId === 'tenant-example' && principalId === 'principal-alex',
			canReview: async ({ tenantId, principalId }) =>
				tenantId === 'tenant-example' && principalId === 'principal-reviewer',
		},
		{
			canFreeze: async ({ tenantId, principalId, cardId, approvalId }) =>
				tenantId === 'tenant-example' &&
				principalId === 'principal-reviewer' &&
				cardId === 'card-1' &&
				/^support-review-run:[a-f0-9]{64}$/.test(approvalId),
		},
		{
			freeze: async ({ cardId }) => ({ status: 'frozen', cardId }),
		},
	)
	gracefulShutdown(logger, [application, eventBridge])
	logger.info('Human review workflow services started')
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Human review services could not start.'}\n`)
	process.exit(1)
})
