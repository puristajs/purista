import 'dotenv/config'

import { createOpenAI } from '@ai-sdk/openai'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { AiSdkProvider } from '@purista/ai'
import {
	DefaultEventBridge,
	DefaultQueueBridge,
	gracefulShutdown,
	initLogger,
	type LogLevelName,
	type Service,
} from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { cors } from 'hono/cors'
import { resetExampleConversationStore } from './service/desk/v1/exampleConversationStore.js'
import { deskV1Service } from './service/desk/v1/index.js'

const buildOpenAiProvider = (apiKey: string) => {
	const openai = createOpenAI({ apiKey })
	return new AiSdkProvider({
		model: openai('gpt-4o-mini'),
		systemPrompt:
			'You are a pragmatic assistant for developers. Keep answers concise, use tools when helpful, and make next steps explicit.',
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
	const queueBridge = new DefaultQueueBridge()
	const conversationStore = resetExampleConversationStore()

	const deskService = await deskV1Service.getInstance(eventBridge, {
		logger,
		queueBridge,
		ai: {
			conversationStore,
			model: {
				'openai:gpt-4o-mini': provider,
			},
		},
	})

	await deskService.start()

	const httpService = await honoV1Service.getInstance(eventBridge, {
		logger,
		serviceConfig: {
			services: [],
		},
	})

	if (process.env.FRONTEND_DEV === '1') {
		httpService.app.use(
			'/api/*',
			cors({
				origin: process.env.FRONTEND_DEV_ORIGIN ?? 'http://localhost:3000',
				allowMethods: ['GET', 'POST', 'OPTIONS'],
				allowHeaders: ['Content-Type', 'Accept'],
			}),
		)
	}

	httpService.registerService(...[deskService].filter((service): service is Service => service !== undefined))

	if (process.env.FRONTEND_DEV !== '1') {
		httpService.app.get('*', serveStatic({ root: './public' }))
	}
	await httpService.start()

	const port = Number(process.env.PORT ?? 3000)
	const server = serve({
		fetch: httpService.app.fetch,
		port,
	})

	logger.info(`ai-basic example started on http://localhost:${port}`)
	if (process.env.FRONTEND_DEV === '1') {
		logger.info(
			'Frontend dev mode active. Run the Vite app on http://localhost:3000 and use the backend on this port for /api proxying.',
		)
	} else {
		logger.info('UI: /index.html')
	}
	logger.info('Command endpoint: POST /api/v1/desk/ask')
	logger.info('Chat agent endpoint: POST /api/v1/agents/deskChatAgent')
	logger.info('Research agent endpoint: POST /api/v1/agents/researchAgent')
	logger.info('Planner agent endpoint: POST /api/v1/agents/deliveryPlannerAgent')
	logger.info('Structured output endpoint: POST /api/v1/agents/architectureReviewAgent')
	logger.info('Reflection endpoint: POST /api/v1/agents/reflectionAgent')
	logger.info('MCP endpoint: POST /api/v1/desk/mcp/call')
	logger.info('MCP tools endpoint: GET /api/v1/desk/mcp/tools')
	logger.info('Agent2Agent endpoint: POST /api/v1/desk/a2a/call')
	logger.info('History load endpoint: POST /api/v1/desk/history/load')
	logger.info('History recent endpoint: POST /api/v1/desk/history/recent')

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
		{ name: 'deskService', destroy: () => deskService.destroy() },
		{ name: 'queueBridge', destroy: () => queueBridge.destroy() },
		{ name: eventBridge.name, destroy: () => eventBridge.destroy() },
	])
}

void main()
