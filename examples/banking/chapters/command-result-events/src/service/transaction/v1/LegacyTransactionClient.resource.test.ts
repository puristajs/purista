import { getEventBridgeMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import { localAccountAccessPolicy } from './AccountAccessPolicy.js'
import type { LegacyTransactionClient } from './LegacyTransactionClient.js'
import type { TransactionRepository } from './TransactionRepository.js'
import { transactionV1ServiceBuilder } from './transactionV1ServiceBuilder.js'

test('accepts the complete typed Transaction resource set', async () => {
	const sandbox = createSandbox()
	const legacyTransactionClient: LegacyTransactionClient = {
		fetchTransaction: sandbox.stub().resolves('debit|25.99|Northwind Books'),
	}
	const transactionRepository: TransactionRepository = {
		save: sandbox.stub(),
		findById: sandbox.stub(),
	}
	const service = await transactionV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
		resources: {
			transactionRepository,
			accountAccessPolicy: localAccountAccessPolicy,
			legacyTransactionClient,
		},
	})

	try {
		expect(service).toBeDefined()
		expect(legacyTransactionClient.fetchTransaction).toBeTypeOf('function')
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})
