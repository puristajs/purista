import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import type { TransactionRepository } from '../../TransactionRepository.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import { getTransactionCommandBuilder } from './getTransactionCommandBuilder.js'

test('returns a transaction from the repository resource', async () => {
	const sandbox = createSandbox()
	const stored = { transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32', amountCents: 2599, direction: 'debit' as const, counterparty: 'Northwind Books', recordedAt: '2026-09-01T10:00:00.000Z' }
	const repository: TransactionRepository = { save: sandbox.stub(), findById: sandbox.stub().resolves(stored) }
	const service = await transactionV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock, resources: { transactionRepository: repository } })
	try {
		const { context } = createCommandContextMock(getTransactionCommandBuilder, { payload: undefined, parameter: { transactionId: stored.transactionId }, resources: { transactionRepository: repository }, sandbox })
		const command = safeBind(getTransactionCommandBuilder.getCommandFunction(), service)
		expect(await command(context, undefined, { transactionId: stored.transactionId })).toEqual(stored)
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})
