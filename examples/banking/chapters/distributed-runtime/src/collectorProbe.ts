import { getCommandMessageMock, initDefaultStateStore, initLogger } from '@purista/core'
import { createApplication } from './application.js'
import { createOtlpTelemetry } from './observability/createOtlpTelemetry.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'

const logger = initLogger('fatal')
const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://127.0.0.1:4318'
const telemetry = createOtlpTelemetry(endpoint)
const repository = new SqliteTransactionRepository(':memory:')
const stateStore = initDefaultStateStore({ logger })
stateStore.setState = async () => {
	throw new Error('state store unavailable')
}
const app = await createApplication(logger, repository, stateStore, telemetry)

try {
	await app.eventBridge.invoke(getCommandMessageMock({
		tenantId: 'tenant-example',
		receiver: { serviceName: 'Transaction', serviceVersion: '1', serviceTarget: 'recordTransaction' },
		payload: {
			payload: { amountCents: 12_500, direction: 'debit', counterparty: 'Northwind Books' },
			parameter: { accountId: 'account-operating' },
		},
	}))
	await new Promise(resolve => setTimeout(resolve, 200))
	await telemetry.forceFlush()
	process.stdout.write('Collector probe exported telemetry.\n')
} finally {
	await app.monitoring.destroy()
	await app.transaction.destroy()
	await stateStore.destroy()
	await repository.destroy()
	await app.eventBridge.destroy()
	await telemetry.destroy()
}
