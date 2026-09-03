import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { openai } from '@purista/harness-openai'
import { createSupportService } from './createSupportService.js'

async function main() {
	const logger = initLogger()
	const apiKey = process.env.OPENAI_API_KEY?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required to start the live example.')
	const provider = openai({ apiKey })
	const model = process.env.OPENAI_MODEL?.trim() || 'gpt-5-mini'
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const support = await createSupportService(eventBridge, logger, {
		supportCasePolicy: {
			canAnalyze: async ({ tenantId, principalId }) =>
				tenantId === 'tenant-example' && principalId === 'principal-alex',
		},
		riskModel: { provider, model },
		responseModel: { provider, model },
	})
	await support.start()
	gracefulShutdown(logger, [support, eventBridge])
	logger.info('Parallel support analysis service started')
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Parallel analysis service could not start.'}\n`)
	process.exit(1)
})
