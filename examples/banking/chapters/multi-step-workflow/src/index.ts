import { mkdir } from 'node:fs/promises'
import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { localDurableExecution } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { createSupportService } from './createSupportService.js'

async function main() {
	const logger = initLogger()
	const apiKey = process.env.OPENAI_API_KEY?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required to start the optional live example.')
	const provider = openai({ apiKey })
	const model = process.env.OPENAI_MODEL?.trim() || 'gpt-5-mini'
	const dataDirectory = '.data/multi-step-workflow'
	await mkdir(dataDirectory, { recursive: true })
	const local = localDurableExecution({ root: dataDirectory })
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const support = await createSupportService(eventBridge, logger, {
		supportCasePolicy: {
			canResolve: async ({ tenantId, principalId }) =>
				tenantId === 'tenant-example' && principalId === 'principal-alex',
		},
		storage: local.storage,
		sandbox: local.sandbox,
		workspace: local.workspace,
		classificationModel: { provider, model },
		resolutionModel: { provider, model },
	})
	await support.start()
	gracefulShutdown(logger, [support, eventBridge])
	logger.info('Durable support resolution service started')
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Support workflow service could not start.'}\n`)
	process.exit(1)
})
