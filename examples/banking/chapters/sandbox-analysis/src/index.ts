import { resolve } from 'node:path'
import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { openai } from '@purista/harness-openai'
import { dockerSandbox } from '@purista/harness-sandbox-docker'
import { createAnalysisService } from './createAnalysisService.js'

async function main() {
	const logger = initLogger()
	const apiKey = process.env.OPENAI_API_KEY?.trim()
	const image = process.env.PURISTA_DOCKER_SANDBOX_IMAGE?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required to start the optional live example.')
	if (!image) throw new Error('PURISTA_DOCKER_SANDBOX_IMAGE is required to start the optional live example.')
	const sandbox = dockerSandbox({
		root: resolve(process.env.PURISTA_DOCKER_SANDBOX_ROOT?.trim() || './runtime/sandboxes'),
		image,
		user: '10001:10001',
	})
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const service = await createAnalysisService(eventBridge, logger, {
		analysisPolicy: {
			canRun: async ({ tenantId, principalId }) => tenantId === 'tenant-example' && principalId === 'principal-analyst',
		},
		analysisModel: {
			provider: openai({ apiKey }),
			model: process.env.OPENAI_MODEL?.trim() || 'gpt-5-mini',
		},
		sandbox,
	})
	await service.start()
	gracefulShutdown(logger, [service, eventBridge])
	logger.info('Sandbox transaction analysis service started')
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Sandbox analysis service could not start.'}\n`)
	process.exit(1)
})
