import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { openai } from '@purista/harness-openai'
import { createReviewApplication } from './createReviewApplication.js'

async function main() {
	const logger = initLogger()
	const apiKey = process.env.OPENAI_API_KEY?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required. Use npm run demo for the credential-free example.')
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
				principalId === 'principal-alex' &&
				cardId === 'card-1' &&
				/^support-review-run:[a-f0-9]{64}$/.test(approvalId),
		},
		{
			freeze: async ({ cardId }) => ({ status: 'frozen', cardId }),
		},
		{
			provider: openai({ apiKey }),
			model: process.env.OPENAI_MODEL?.trim() || 'gpt-5-mini',
		},
	)
	gracefulShutdown(logger, [application, eventBridge])
	logger.info('Human review workflow services started')
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Human review services could not start.'}\n`)
	process.exit(1)
})
