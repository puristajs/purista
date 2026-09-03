import { getCommandMessageMock, initDefaultStateStore, initLogger } from '@purista/core'
import { afterEach, expect, test } from 'vitest'
import { createApplication } from './application.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'
import { latestLargeDebitSignalKey } from './service/monitoring/v1/monitoringSignal.js'

let app: Awaited<ReturnType<typeof createApplication>> | undefined

afterEach(async () => {
	if (!app) return
	await app.monitoring.destroy()
	await app.transaction.destroy()
	await app.monitoringStateStore.destroy()
	await app.transactionRepository.destroy()
	await app.eventBridge.destroy()
	app = undefined
})

async function readSignal() {
	for (let attempt = 0; attempt < 50; attempt++) {
		const state = await app!.monitoringStateStore.getState(latestLargeDebitSignalKey)
		const signal = state[latestLargeDebitSignalKey]
		if (signal) return signal
		await new Promise(resolve => setTimeout(resolve, 10))
	}
	throw new Error('Monitoring signal was not written')
}

test('routes a recorded transaction result to Monitoring', async () => {
	const logger = initLogger('fatal')
	app = await createApplication(
		logger,
		new SqliteTransactionRepository(':memory:'),
		initDefaultStateStore({ logger }),
	)

	await app.eventBridge.invoke(getCommandMessageMock({
		tenantId: 'tenant-example',
		principalId: 'principal-alex',
		receiver: {
			serviceName: 'Transaction',
			serviceVersion: '1',
			serviceTarget: 'recordTransaction',
		},
		payload: {
			payload: {
				amountCents: 12_500,
				direction: 'debit',
				counterparty: 'Northwind Books',
			},
			parameter: { accountId: 'account-operating' },
		},
	}))

	expect(await readSignal()).toMatchObject({
		accountId: 'account-operating',
		amountCents: 12_500,
	})
})
