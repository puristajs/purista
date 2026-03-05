import 'dotenv/config'

import { createOpenAI } from '@ai-sdk/openai'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { AiSdkProvider } from '@purista/ai'
import { DefaultEventBridge, gracefulShutdown, initLogger, type LogLevelName, type Service } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'

import { supportAgent } from './agents/supportAgent/v1/supportAgent.js'
import { triageAgent } from './agents/triageAgent/v1/triageAgent.js'
import { supportV1Service } from './service/support/v1/index.js'

const buildOpenAiProvider = (apiKey: string) => {
	const openai = createOpenAI({ apiKey })
	return new AiSdkProvider({
		model: openai('gpt-4o-mini'),
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

	const triageAgentInstance = await triageAgent.getInstance(eventBridge, {
		logger,
		models: {
			'openai:gpt-4o-mini': provider,
		},
		poolConfig: {
			maxWorkers: 1,
		},
	})
	await triageAgentInstance.start()

	const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
		logger,
		models: {
			'openai:gpt-4o-mini': provider,
		},
		poolConfig: {
			poolId: 'support',
			maxWorkers: 2,
		},
	})
	await supportAgentInstance.start()

	const triageAgentService = (triageAgentInstance as unknown as { service?: Service }).service
	const supportAgentService = (supportAgentInstance as unknown as { service?: Service }).service

	const httpService = await honoV1Service.getInstance(eventBridge, {
		logger,
		serviceConfig: {
			services: [supportService, supportAgentService, triageAgentService].filter(
				(service): service is Service => service !== undefined,
			),
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
	logger.info('Agent stream endpoint: POST /api/v1/support/ask/stream')
	logger.info('Conversation endpoint: POST /api/v1/support/conversation')
	logger.info('MCP endpoint: POST /api/v1/support/mcp/call')
	logger.info('MCP tools endpoint: GET /api/v1/support/mcp/tools')
	logger.info('Agent2Agent endpoint: POST /api/v1/support/a2a/call')
	logger.info('Direct agent endpoint: POST /api/v1/agents/supportAgent')

	gracefulShutdown(logger, [
		{
			name: 'hono-http-server',
			destroy: async () =>
				await new Promise<void>((resolve, reject) => {
					server.close(error => {
						if (error) {
							reject(error)
							return
						}
						resolve()
					})
				}),
		},
		{ name: 'honoV1Service', destroy: () => httpService.destroy() },
		{ name: 'supportAgent', destroy: () => supportAgentInstance.stop() },
		{ name: 'triageAgent', destroy: () => triageAgentInstance.stop() },
		{ name: 'supportService', destroy: () => supportService.destroy() },
		{ name: eventBridge.name, destroy: () => eventBridge.destroy() },
	])
}

void main()
