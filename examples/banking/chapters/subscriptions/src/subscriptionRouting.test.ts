import {
	getCommandSuccessMessageMock,
	initDefaultStateStore,
	initLogger,
} from '@purista/core'
import { afterEach, expect, test } from 'vitest'
import { createApplication } from './application.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'
import { latestLargeDebitSignalKey } from './service/monitoring/v1/monitoringSignal.js'
import { ServiceEvent } from './service/serviceEvent.enum.js'

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

const payload = {
	transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
	accountId: 'account-operating',
	tenantId: 'tenant-example',
	amountCents: 12_500,
	direction: 'debit' as const,
	counterparty: 'Northwind Books',
	recordedAt: '2026-09-01T10:00:00.000Z',
}

async function setup() {
	const logger = initLogger('fatal')
	app = await createApplication(
		logger,
		new SqliteTransactionRepository(':memory:'),
		initDefaultStateStore({ logger }),
	)
}

async function emit(overrides: Parameters<typeof getCommandSuccessMessageMock>[1] = {}) {
	await app!.eventBridge.emitMessage(getCommandSuccessMessageMock(payload, {
		eventName: ServiceEvent.TransactionRecordedV1,
		tenantId: 'tenant-example',
		sender: {
			serviceName: 'Transaction',
			serviceVersion: '1',
			serviceTarget: 'recordTransaction',
			instanceId: 'transaction-instance',
		},
		...overrides,
	}))
	await new Promise(resolve => setTimeout(resolve, 20))
}

async function signal() {
	const state = await app!.monitoringStateStore.getState(latestLargeDebitSignalKey)
	return state[latestLargeDebitSignalKey]
}

test.each([
	['another event', { eventName: 'transaction.imported.v1' }],
	['another sender', {
		sender: {
			serviceName: 'Reporting',
			serviceVersion: '1',
			serviceTarget: 'recordTransaction',
			instanceId: 'reporting-instance',
		},
	}],
	['another tenant', { tenantId: 'tenant-other' }],
])('ignores %s', async (_name, overrides) => {
	await setup()
	await emit(overrides)
	expect(await signal()).toBeUndefined()
})

test('stores the same signal for repeated matching delivery', async () => {
	await setup()
	await emit()
	const first = await signal()
	await emit()
	const second = await signal()

	expect(first).toEqual({
		transactionId: payload.transactionId,
		accountId: payload.accountId,
		amountCents: payload.amountCents,
	})
	expect(second).toEqual(first)
})
