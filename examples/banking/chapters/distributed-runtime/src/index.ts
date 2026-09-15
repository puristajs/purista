import { gracefulShutdown, initDefaultStateStore, initLogger } from '@purista/core'
import { createApplication } from './application.js'
import { createTelemetryFromEnvironment } from './observability/createOtlpTelemetry.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'

async function main() {
	const logger = initLogger()
	const telemetry = createTelemetryFromEnvironment()
	const transactionRepository = new SqliteTransactionRepository('var/example-bank.sqlite')
	const monitoringStateStore = initDefaultStateStore({ logger })
	const app = await createApplication(logger, transactionRepository, monitoringStateStore, telemetry)

	gracefulShutdown(logger, [
		app.monitoring,
		app.transaction,
		app.monitoringStateStore,
		app.transactionRepository,
		app.eventBridge,
		...(telemetry ? [telemetry] : []),
	])
	logger.info('Transaction and Monitoring services started')
}

main().catch(() => {
	process.stderr.write('Example Bank could not start.\n')
	process.exit(1)
})
