import { serve } from '@hono/node-server'
import {
	DefaultQueueBridge,
	gracefulShutdown,
	initDefaultStateStore,
	initLogger,
} from '@purista/core'
import { z } from 'zod'
import { createKnowledgeApplication } from './knowledgeApplication.js'
import { createNodeHttpListener } from './nodeHttpListener.js'
import { PgKnowledgeRepository } from './resources/PgKnowledgeRepository.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'
import { localIdentityProvider } from './service/identity/v1/LocalIdentityProvider.js'
import { deterministicKnowledgeEmbeddingProvider } from './service/knowledge/v1/DeterministicKnowledgeEmbeddingProvider.js'
import { localKnowledgeCollectionPolicy } from './service/knowledge/v1/KnowledgeCollectionPolicy.js'

async function main() {
	const port = z.coerce.number().int().min(1).max(65535).parse(process.env.PORT ?? 3000)
	const databaseUrl = process.env.DATABASE_URL
		?? 'postgres://example_bank:local-example-password@127.0.0.1:55432/example_bank'
	const logger = initLogger()
	const transactionRepository = new SqliteTransactionRepository('var/example-bank.sqlite')
	const identityStateStore = initDefaultStateStore({ logger })
	const knowledgeStateStore = initDefaultStateStore({ logger })
	const queueBridge = new DefaultQueueBridge({ maxAttempts: 3 })
	const knowledgeRepository = new PgKnowledgeRepository(databaseUrl)
	const app = await createKnowledgeApplication(logger, {
		transactionRepository,
		identityProvider: localIdentityProvider,
		identityStateStore,
		queueBridge,
		knowledgeStateStore,
		knowledgeCollectionPolicy: localKnowledgeCollectionPolicy,
		knowledgeEmbeddingProvider: deterministicKnowledgeEmbeddingProvider,
		knowledgeRepository,
	})
	const nodeServer = serve({ fetch: app.http.app.fetch, hostname: '127.0.0.1', port })
	const nodeHttpListener = createNodeHttpListener(nodeServer)

	gracefulShutdown(logger, [
		app.http.prepareDestroy(),
		nodeHttpListener,
		app.http,
		app.knowledge,
		app.transaction,
		app.identity,
		app.bankProfile,
		knowledgeStateStore,
		identityStateStore,
		queueBridge,
		knowledgeRepository,
		transactionRepository,
		app.eventBridge,
	])
	logger.info({ port }, 'Example Bank HTTP server with knowledge ingestion started')
}

main().catch(() => {
	process.stderr.write('Example Bank HTTP server could not start.\n')
	process.exit(1)
})
