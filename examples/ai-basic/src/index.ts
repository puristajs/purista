import 'dotenv/config'

import { createOpenAI } from '@ai-sdk/openai'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { AiSdkProvider } from '@purista/ai'
import { DefaultEventBridge, gracefulShutdown, initLogger, type LogLevelName } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'

import { supportAgentDefinition } from './agents/supportAgent/v1/supportAgent.js'
import { triageAgentDefinition } from './agents/triageAgent/v1/triageAgent.js'
import { supportV1Service } from './service/support/v1/index.js'

const buildOpenAiProvider = (apiKey: string) => {
	const openai = createOpenAI({ apiKey })
	return new AiSdkProvider({
		model: openai('gpt-5.2-mini'),
		systemPrompt:
			'You are a production support assistant. Keep answers concise, actionable, and mention next concrete steps.',
		defaults: { temperature: 0.2 },
	})
}

export async function main() {
	const logger = initLogger((process.env.LOG_LEVEL as LogLevelName | undefined) ?? 'info')
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()

	const apiKey = process.env.OPENAI_API_KEY
	if (!apiKey) {
		throw new Error('OPENAI_API_KEY is required')
	}

	const provider = buildOpenAiProvider(apiKey)
	const supportService = await supportV1Service.getInstance(eventBridge, { logger })
	await supportService.start()

	const triageAgent = await triageAgentDefinition.getInstance(eventBridge, {
		logger,
		models: {
			'openai:gpt-5.2-mini': provider,
		},
		poolConfig: {
			maxWorkers: 1,
		},
	})
	await triageAgent.start()

	const supportAgent = await supportAgentDefinition.getInstance(eventBridge, {
		logger,
		models: {
			'openai:gpt-5.2-mini': provider,
		},
		poolConfig: {
			poolId: 'support',
			maxWorkers: 2,
		},
	})
	await supportAgent.start()

	const httpService = await honoV1Service.getInstance(eventBridge, {
		logger,
		serviceConfig: {
			services: [supportService, supportAgent, triageAgent],
		},
	})

	httpService.app.get('*', serveStatic({ root: './public' }))
	await httpService.start()

	const port = Number(process.env.PORT ?? 3000)
	const server = serve({
		fetch: httpService.app.fetch,
		port,
	})

	logger.info(`ai-basic example started on http://localhost:${port}`)
	logger.info('UI: /index.html')
	logger.info('Command endpoint: POST /api/v1/support/ask')
	logger.info('Agent stream endpoint: POST /api/v1/agents/supportAgent')
	logger.info('Follow-up endpoint: POST /api/v1/support/follow-up')

	gracefulShutdown(logger, [server, httpService, supportAgent, triageAgent, supportService, eventBridge])
}

void main()
