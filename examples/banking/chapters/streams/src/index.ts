import { serve } from '@hono/node-server'
import { gracefulShutdown, initDefaultStateStore, initLogger } from '@purista/core'
import { z } from 'zod'
import { createApplication } from './application.js'
import { createNodeHttpListener } from './nodeHttpListener.js'
import { SqliteTransactionAnalysisReader } from './resources/SqliteTransactionAnalysisReader.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'

async function main() {
	const port = z.coerce.number().int().min(1).max(65535).parse(process.env.PORT ?? 3000)
	const logger = initLogger()
	const transactionRepository = new SqliteTransactionRepository('var/example-bank.sqlite')
	const transactionAnalysisReader = new SqliteTransactionAnalysisReader('var/example-bank.sqlite')
	const identityStateStore = initDefaultStateStore({ logger })
	const app = await createApplication(
		logger, transactionRepository, undefined, identityStateStore, transactionAnalysisReader,
	)
	const nodeServer = serve({ fetch: app.http.app.fetch, hostname: '127.0.0.1', port })
	const nodeHttpListener = createNodeHttpListener(nodeServer)

	gracefulShutdown(logger, [
		app.http.prepareDestroy(), nodeHttpListener, app.http,
		app.analysis, app.transaction, app.identity, app.bankProfile,
		app.identityStateStore, transactionAnalysisReader, transactionRepository, app.eventBridge,
	])
	logger.info({ port }, 'Example Bank HTTP server with Analysis stream started')
}

main().catch(() => {
	process.stderr.write('Example Bank HTTP server could not start.\n')
	process.exit(1)
})
