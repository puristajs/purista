import { serve } from '@hono/node-server'
import { gracefulShutdown, initLogger } from '@purista/core'
import { z } from 'zod'
import { createKnowledgeApplication } from './createKnowledgeApplication.js'
import { createNodeHttpListener } from './nodeHttpListener.js'

async function main() {
	const port = z.coerce
		.number()
		.int()
		.min(1)
		.max(65_535)
		.parse(process.env.PORT ?? 3000)
	const logger = initLogger()
	const application = await createKnowledgeApplication(logger)
	const server = serve({ fetch: application.http.app.fetch, hostname: '127.0.0.1', port })
	gracefulShutdown(logger, [
		application.http.prepareDestroy(),
		createNodeHttpListener(server),
		application.http,
		application.knowledge,
		application.identity,
		application.repository,
		application.stateStore,
		application.eventBridge,
	])
	logger.info({ port }, 'Example Bank knowledge application started')
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Knowledge application could not start.'}\n`)
	process.exit(1)
})
