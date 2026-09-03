import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { openai } from '@purista/harness-openai'
import { createSupportService } from './createSupportService.js'

async function main() {
	const logger = initLogger()
	const apiKey = process.env.OPENAI_API_KEY?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required. Use npm run demo for the credential-free example.')
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const support = await createSupportService(eventBridge, logger, {
		policy: {
			canClassify: async ({ tenantId, principalId }) =>
				tenantId === 'tenant-example' && principalId === 'principal-alex',
		},
		model: {
			provider: openai({ apiKey }),
			model: process.env.OPENAI_MODEL?.trim() || 'gpt-5-mini',
		},
	})
	await support.start()
	gracefulShutdown(logger, [support, eventBridge])
	logger.info('Support classification service started')
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Classification service could not start.'}\n`)
	process.exit(1)
})
