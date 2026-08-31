import { gracefulShutdown, initLogger } from '@purista/core'
import { getEventBridge } from './eventbridge.js'
import { startHttpServer } from './http.js'
import { bankingV1Service } from './service/banking/v1/bankingV1Service.js'
import { TransactionRepository } from './transactionRepository.js'

async function main() {
	const logger = initLogger()
	const eventBridge = await getEventBridge(logger)
	const banking = await bankingV1Service.getInstance(eventBridge, {
		logger,
		resources: { transactions: new TransactionRepository() },
	})
	await banking.start()

	const { honoService, closeSocket } = await startHttpServer({
		eventBridge,
		logger,
		services: [banking],
	})

	gracefulShutdown(logger, [honoService.prepareDestroy(), eventBridge, banking, closeSocket, honoService])
	logger.info('Example Bank is listening on http://127.0.0.1:3000')
}

main().catch(error => {
	process.stderr.write(`${error}\n`)
	process.exit(1)
})
