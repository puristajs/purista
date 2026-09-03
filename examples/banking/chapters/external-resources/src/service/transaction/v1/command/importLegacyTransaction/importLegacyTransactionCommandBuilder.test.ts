import {
	getCommandMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	isCommandErrorResponse,
	isCommandSuccessResponse,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test } from 'vitest'
import { parseLegacyTransaction } from '../../legacyTransaction.js'
import type { TransactionRepository } from '../../TransactionRepository.js'
import { transactionTestResources } from '../../testing/transactionTestResources.js'
import { transactionV1Service } from '../../transactionV1Service.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('legacy transaction input transform', () => {
	test('parses one cent without floating-point rounding', () => {
		expect(parseLegacyTransaction('credit|0.01|Coffee Shop')).toEqual({
			amountCents: 1,
			direction: 'credit',
			counterparty: 'Coffee Shop',
		})
	})

	test('rejects malformed and overflowing decimal text', () => {
		expect(() => parseLegacyTransaction('debit|25,99|Northwind Books')).toThrow('Legacy transaction record is invalid')
		expect(() => parseLegacyTransaction('debit|90071992547410.00|Northwind Books')).toThrow('Legacy transaction record is invalid')
	})

	test('runs normal domain validation before the guard and handler', async () => {
		const save = sandbox.stub()
		const transactionRepository: TransactionRepository = { save, findById: sandbox.stub() }
		const eventBridge = getEventBridgeMock(sandbox).mock
		const service = await transactionV1Service.getInstance(eventBridge, {
			logger: getLoggerMock(sandbox).mock,
			resources: transactionTestResources(transactionRepository),
		})
		await service.start()
		try {
			const response = await service.executeCommand(getCommandMessageMock({
				principalId: 'principal-alex',
				tenantId: 'tenant-example',
				contentType: 'text/plain',
				receiver: {
					serviceName: 'Transaction',
					serviceVersion: '1',
					serviceTarget: 'importLegacyTransaction',
				},
				payload: {
					payload: 'debit|1.00|A',
					parameter: { accountId: 'account-operating' },
				},
			}))
			expect(isCommandErrorResponse(response)).toBe(true)
			expect(isCommandSuccessResponse(response)).toBe(false)
			expect(save.called).toBe(false)
		} finally {
			await service.destroy()
		}
	})
})
