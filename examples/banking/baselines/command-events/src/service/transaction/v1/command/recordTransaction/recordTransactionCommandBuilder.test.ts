import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import type { TransactionRepository } from '../../TransactionRepository.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import { recordTransactionCommandBuilder } from './recordTransactionCommandBuilder.js'

test('saves a tenant-scoped transaction through the repository resource', async () => {
	const sandbox = createSandbox()
	const payload = { amountCents: 12_500, direction: 'debit' as const, counterparty: 'Northwind Books' }
	const parameter = { accountId: 'account-operating' }
	const stored = {
		...payload,
		...parameter,
		tenantId: 'tenant-example',
		transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
		recordedAt: '2026-09-01T10:00:00.000Z',
	}
	const save = sandbox.stub().resolves(stored)
	const repository: TransactionRepository = { save }
	const service = await transactionV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
		resources: { transactionRepository: repository },
	})
	try {
		const mocked = createCommandContextMock(recordTransactionCommandBuilder, {
			payload,
			parameter,
			resources: { transactionRepository: repository },
			sandbox,
		})
		mocked.context.message = { ...mocked.context.message, tenantId: 'tenant-example' }
		const command = safeBind(recordTransactionCommandBuilder.getCommandFunction(), service)

		expect(await command(mocked.context, payload, parameter)).toEqual(stored)
		expect(save.calledOnceWith({ ...payload, ...parameter, tenantId: 'tenant-example' })).toBe(true)
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})
