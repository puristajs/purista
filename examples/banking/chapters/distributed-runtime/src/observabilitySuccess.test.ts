import { getCommandMessageMock, initDefaultStateStore, initLogger } from '@purista/core'
import { afterEach, expect, test } from 'vitest'
import { createApplication } from './application.js'
import { createTestTelemetry, metricNames } from './observability/testTelemetry.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'
import { latestLargeDebitSignalKey } from './service/monitoring/v1/monitoringSignal.js'

let cleanup: (() => Promise<void>) | undefined
afterEach(async () => cleanup?.())

test('exports successful Framework spans and service-owned metrics', async () => {
	const logger = initLogger('fatal')
	const telemetry = createTestTelemetry()
	const repository = new SqliteTransactionRepository(':memory:')
	const stateStore = initDefaultStateStore({ logger })
	const app = await createApplication(logger, repository, stateStore, telemetry)
	cleanup = async () => {
		await app.monitoring.destroy()
		await app.transaction.destroy()
		await stateStore.destroy()
		await repository.destroy()
		await app.eventBridge.destroy()
		await telemetry.destroy()
	}

	await app.eventBridge.invoke(getCommandMessageMock({
		tenantId: 'tenant-example',
		receiver: { serviceName: 'Transaction', serviceVersion: '1', serviceTarget: 'recordTransaction' },
		payload: {
			payload: { amountCents: 12_500, direction: 'debit', counterparty: 'Northwind Books' },
			parameter: { accountId: 'account-operating' },
		},
	}))

	for (let attempt = 0; attempt < 50; attempt += 1) {
		const state = await stateStore.getState(latestLargeDebitSignalKey)
		if (state[latestLargeDebitSignalKey]) break
		await new Promise(resolve => setTimeout(resolve, 10))
	}
	await telemetry.forceFlush()

	const spanNames = telemetry.traceExporter.getFinishedSpans().map(span => span.name)
	expect(spanNames).toEqual(expect.arrayContaining([
		'purista.command.invoke', 'recordTransaction', 'observeLargeDebit',
	]))
	expect(metricNames(telemetry.metricExporter)).toEqual(expect.arrayContaining([
		'app.transaction.recorded',
		'app.monitoring.large_debit.signals',
		'purista.command.executions',
		'purista.subscription.executions',
	]))
})
