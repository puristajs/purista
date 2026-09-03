import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { sqliteHarnessStorage } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { createSupportService } from './createSupportService.js'

async function main() {
	const logger = initLogger()
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const apiKey = process.env.OPENAI_API_KEY?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required to run the live conversation-history example.')
	const storage = sqliteHarnessStorage({
		file: process.env.HARNESS_STORAGE_FILE?.trim() || 'conversation-history.sqlite',
	})
	const support = await createSupportService(eventBridge, logger, {
		policy: {
			canAccess: async ({ tenantId, principalId }) => tenantId === 'tenant-example' && principalId === 'principal-alex',
		},
		model: {
			provider: openai({ apiKey }),
			model: process.env.OPENAI_MODEL?.trim() || 'gpt-5-mini',
		},
		storage,
	})
	await support.start()
	gracefulShutdown(logger, [support, eventBridge])
	logger.info('Support conversation service started')
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Conversation service could not start.'}\n`)
	process.exit(1)
})
