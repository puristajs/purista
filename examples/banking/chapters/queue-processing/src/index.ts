import { serve } from '@hono/node-server'
import { DefaultQueueBridge, gracefulShutdown, initDefaultStateStore, initLogger } from '@purista/core'
import { z } from 'zod'
import { createApplication } from './application.js'
import { createNodeHttpListener } from './nodeHttpListener.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'

async function main() {
	const port = z.coerce.number().int().min(1).max(65535).parse(process.env.PORT ?? 3000)
	const logger = initLogger()
	const transactionRepository = new SqliteTransactionRepository('var/example-bank.sqlite')
	const identityStateStore = initDefaultStateStore({ logger })
	const reportingStateStore = initDefaultStateStore({ logger })
	const queueBridge = new DefaultQueueBridge({ maxAttempts: 3 })
	const app = await createApplication(
		logger, transactionRepository, undefined, identityStateStore, queueBridge, reportingStateStore,
	)
	const nodeServer = serve({ fetch: app.http.app.fetch, hostname: '127.0.0.1', port })
	const nodeHttpListener = createNodeHttpListener(nodeServer)

	gracefulShutdown(logger, [
		app.http.prepareDestroy(), nodeHttpListener, app.http,
		app.reporting, app.transaction, app.identity, app.bankProfile,
		app.reportingStateStore, app.identityStateStore,
		queueBridge, transactionRepository, app.eventBridge,
	])
	logger.info({ port }, 'Example Bank HTTP server with Reporting queue started')
}

main().catch(() => {
	process.stderr.write('Example Bank HTTP server could not start.\n')
	process.exit(1)
})
