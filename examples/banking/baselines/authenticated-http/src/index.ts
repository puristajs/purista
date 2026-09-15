import { serve } from '@hono/node-server'
import { gracefulShutdown, initLogger } from '@purista/core'
import { z } from 'zod'
import { createApplication } from './application.js'
import { createNodeHttpListener } from './nodeHttpListener.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'

async function main() {
	const port = z.coerce.number().int().min(1).max(65535).parse(process.env.PORT ?? 3000)
	const logger = initLogger()
	const transactionRepository = new SqliteTransactionRepository('var/example-bank.sqlite')
	const { eventBridge, bankProfile, identity, identityStateStore, transaction, http } = await createApplication(
		logger,
		transactionRepository,
	)
	const nodeServer = serve({ fetch: http.app.fetch, hostname: '127.0.0.1', port })
	const nodeHttpListener = createNodeHttpListener(nodeServer)

	gracefulShutdown(logger, [
		http.prepareDestroy(),
		nodeHttpListener,
		http,
		transaction,
		identity,
		bankProfile,
		identityStateStore,
		transactionRepository,
		eventBridge,
	])
	logger.info({ port }, 'Example Bank HTTP server started')
}

main().catch(() => {
	process.stderr.write('Example Bank HTTP server could not start.\n')
	process.exit(1)
})
