import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import type { TransactionRepository } from '../../TransactionRepository.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import { recordTransactionCommandBuilder } from './recordTransactionCommandBuilder.js'

const input = { amountCents: 2599, direction: 'debit' as const, counterparty: 'Northwind Books' }

test('records validated input through the repository resource', async () => {
	const sandbox = createSandbox()
	const stored = { ...input, transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32', recordedAt: '2026-09-01T10:00:00.000Z' }
	const save = sandbox.stub().resolves(stored)
	const repository: TransactionRepository = { save, findById: sandbox.stub() }
	const service = await transactionV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock, resources: { transactionRepository: repository } })
	try {
		const { context } = createCommandContextMock(recordTransactionCommandBuilder, { payload: input, parameter: {}, resources: { transactionRepository: repository }, sandbox })
		const command = safeBind(recordTransactionCommandBuilder.getCommandFunction(), service)
		expect(await command(context, input, {})).toEqual(stored)
		expect(save.calledOnce).toBe(true)
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})

test('does not return success when the repository fails', async () => {
	const sandbox = createSandbox()
	const failure = new Error('database unavailable')
	const repository: TransactionRepository = { save: sandbox.stub().rejects(failure), findById: sandbox.stub() }
	const service = await transactionV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock, resources: { transactionRepository: repository } })
	try {
		const { context } = createCommandContextMock(recordTransactionCommandBuilder, { payload: input, parameter: {}, resources: { transactionRepository: repository }, sandbox })
		const command = safeBind(recordTransactionCommandBuilder.getCommandFunction(), service)
		await expect(command(context, input, {})).rejects.toBe(failure)
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})
