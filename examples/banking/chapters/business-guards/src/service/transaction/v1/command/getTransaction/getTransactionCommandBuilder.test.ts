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
import { getTransactionCommandBuilder } from './getTransactionCommandBuilder.js'

test('returns an authorized transaction from the repository resource', async () => {
	const sandbox = createSandbox()
	const stored = {
		accountId: 'account-operating',
		tenantId: 'tenant-example',
		transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
		amountCents: 2599,
		direction: 'debit' as const,
		counterparty: 'Northwind Books',
		recordedAt: '2026-09-01T10:00:00.000Z',
	}
	const parameter = { accountId: stored.accountId, transactionId: stored.transactionId }
	const transactionRepository: TransactionRepository = {
		save: sandbox.stub(),
		findById: sandbox.stub().resolves(stored),
	}
	const resources = { transactionRepository, accountAccessPolicy: localAccountAccessPolicy }
	const service = await transactionV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
		resources,
	})
	try {
		const { context } = createCommandContextMock(getTransactionCommandBuilder, {
			payload: undefined,
			parameter,
			resources,
			sandbox,
		})
		context.message = getCommandMessageMock({
			principalId: 'principal-alex',
			tenantId: 'tenant-example',
			payload: { payload: undefined, parameter },
		})
		const command = safeBind(getTransactionCommandBuilder.getCommandFunction(), service)
		expect(await command(context, undefined, parameter)).toEqual(stored)
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})
