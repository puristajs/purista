import {
	createCommandContextMock,
	getCommandMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	safeBind,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import { localAccountAccessPolicy } from '../../AccountAccessPolicy.js'
import type { TransactionRepository } from '../../TransactionRepository.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import { recordTransactionCommandBuilder } from './recordTransactionCommandBuilder.js'

const input = { amountCents: 2599, direction: 'debit' as const, counterparty: 'Northwind Books' }
const parameter = { accountId: 'account-operating' }

function setAlexMessage(
	context: ReturnType<typeof createCommandContextMock<typeof recordTransactionCommandBuilder>>['context'],
) {
	context.message = getCommandMessageMock({
		principalId: 'principal-alex',
		tenantId: 'tenant-example',
		payload: { payload: input, parameter },
	})
}

test('records validated input with trusted account scope', async () => {
	const sandbox = createSandbox()
	const stored = {
		...input,
		...parameter,
		tenantId: 'tenant-example',
		transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
		recordedAt: '2026-09-01T10:00:00.000Z',
	}
	const save = sandbox.stub().resolves(stored)
	const transactionRepository: TransactionRepository = { save, findById: sandbox.stub() }
	const resources = { transactionRepository, accountAccessPolicy: localAccountAccessPolicy }
	const service = await transactionV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
		resources,
	})
	try {
		const { context } = createCommandContextMock(recordTransactionCommandBuilder, {
			payload: input,
			parameter,
			resources,
			sandbox,
		})
		setAlexMessage(context)
		const command = safeBind(recordTransactionCommandBuilder.getCommandFunction(), service)
		expect(await command(context, input, parameter)).toEqual(stored)
		expect(save.calledOnceWith({ ...input, ...parameter, tenantId: 'tenant-example' })).toBe(true)
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})

test('does not return success when the repository fails', async () => {
	const sandbox = createSandbox()
	const failure = new Error('database unavailable')
	const transactionRepository: TransactionRepository = {
		save: sandbox.stub().rejects(failure),
		findById: sandbox.stub(),
	}
	const resources = { transactionRepository, accountAccessPolicy: localAccountAccessPolicy }
	const service = await transactionV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
		resources,
	})
	try {
		const { context } = createCommandContextMock(recordTransactionCommandBuilder, {
			payload: input,
			parameter,
			resources,
			sandbox,
		})
		setAlexMessage(context)
		const command = safeBind(recordTransactionCommandBuilder.getCommandFunction(), service)
		await expect(command(context, input, parameter)).rejects.toBe(failure)
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})
