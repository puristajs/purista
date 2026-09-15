import { gracefulShutdown, initLogger } from '@purista/core'
import { getEventBridge } from './eventbridge.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'

async function main() {
	const logger = initLogger()
	const eventBridge = await getEventBridge(logger)
	const transactionRepository = new SqliteTransactionRepository('var/example-bank.sqlite')
	const transaction = await transactionV1Service.getInstance(eventBridge, {
		logger,
		resources: { transactionRepository },
	})
	await transaction.start()

	gracefulShutdown(logger, [transaction, transactionRepository, eventBridge])
	logger.info('Transaction service started')
}

main().catch(() => {
	process.stderr.write('Example Bank could not start.\n')
	process.exit(1)
})
