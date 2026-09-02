import {
	EBMessageType,
	getCommandMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	isCommandErrorResponse,
	isCommandSuccessResponse,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, expect, test } from 'vitest'
import { ServiceEvent } from '../../../../serviceEvent.enum.js'
import type { TransactionRepository } from '../../TransactionRepository.js'
import { transactionV1Service } from '../../transactionV1Service.js'

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

async function execute(save: TransactionRepository['save']) {
	const repository: TransactionRepository = { save }
	const service = await transactionV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
		resources: { transactionRepository: repository },
	})
	await service.start()
	const message = getCommandMessageMock({
		tenantId: 'tenant-example',
		principalId: 'principal-alex',
		receiver: {
			serviceName: 'Transaction',
			serviceVersion: '1',
			serviceTarget: 'recordTransaction',
		},
		payload: { payload, parameter },
	})
	return { service, response: await service.executeCommand(message) }
}

test('names the successful command response', async () => {
	const fixture = await execute(sandbox.stub().resolves(stored))
	try {
		expect(isCommandSuccessResponse(fixture.response)).toBe(true)
		if (!isCommandSuccessResponse(fixture.response)) throw new Error('Expected success')
		expect(fixture.response.messageType).toBe(EBMessageType.CommandSuccessResponse)
		expect(fixture.response.eventName).toBe(ServiceEvent.TransactionRecordedV1)
		expect(fixture.response.tenantId).toBe('tenant-example')
		expect(fixture.response.payload).toEqual(stored)
	} finally {
		await fixture.service.destroy()
	}
})

test('does not name a failed command response', async () => {
	const fixture = await execute(sandbox.stub().rejects(new Error('database unavailable')))
	try {
		expect(isCommandErrorResponse(fixture.response)).toBe(true)
		expect(fixture.response.eventName).toBeUndefined()
	} finally {
		await fixture.service.destroy()
	}
})
