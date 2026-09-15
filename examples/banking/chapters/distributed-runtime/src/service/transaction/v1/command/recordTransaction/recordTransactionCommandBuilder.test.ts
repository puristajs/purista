import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox, type SinonStub } from 'sinon'
import { afterEach, expect, test } from 'vitest'
import type { TransactionRepository } from '../../TransactionRepository.js'
import { transactionRecordedMetricName } from '../../transactionMetrics.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import { recordTransactionCommandBuilder } from './recordTransactionCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

const payload = { amountCents: 12_500, direction: 'debit' as const, counterparty: 'Northwind Books' }
const parameter = { accountId: 'account-operating' }
const stored = {
	...payload,
	...parameter,
	tenantId: 'tenant-example',
	transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
	recordedAt: '2026-09-01T10:00:00.000Z',
}

async function setup(save: SinonStub) {
	const repository: TransactionRepository = { save }
	const service = await transactionV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
		resources: { transactionRepository: repository },
	})
	const mocked = createCommandContextMock(recordTransactionCommandBuilder, {
		payload, parameter, resources: { transactionRepository: repository }, sandbox,
	})
	mocked.context.message = { ...mocked.context.message, tenantId: 'tenant-example' }
	const add = mocked.context.metrics[transactionRecordedMetricName].add as SinonStub
	const command = safeBind(recordTransactionCommandBuilder.getCommandFunction(), service)
	return { service, mocked, add, command }
}

test('records a bounded success metric after saving', async () => {
	const fixture = await setup(sandbox.stub().resolves(stored))
	try {
		await expect(fixture.command(fixture.mocked.context, payload, parameter)).resolves.toEqual(stored)
		expect(fixture.add.calledOnceWith(1, {
			direction: 'debit', amount_band: 'at_least_100_eur',
		})).toBe(true)
	} finally {
		await fixture.service.destroy()
	}
})

test('does not record a success metric when persistence fails', async () => {
	const fixture = await setup(sandbox.stub().rejects(new Error('database unavailable')))
	try {
		await expect(fixture.command(fixture.mocked.context, payload, parameter))
			.rejects.toThrow('database unavailable')
		expect(fixture.add.called).toBe(false)
	} finally {
		await fixture.service.destroy()
	}
})
