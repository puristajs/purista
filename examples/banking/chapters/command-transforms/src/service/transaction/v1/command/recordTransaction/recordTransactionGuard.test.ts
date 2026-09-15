import {
	createCommandContextMock,
	getCommandMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	safeBind,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test } from 'vitest'
import { localAccountAccessPolicy } from '../../AccountAccessPolicy.js'
import type { TransactionRepository } from '../../TransactionRepository.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import { recordTransactionCommandBuilder } from './recordTransactionCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

const payload = {
	amountCents: 2599,
	direction: 'debit' as const,
	counterparty: 'Northwind Books',
}
const parameter = { accountId: 'account-operating' }

async function runAs(principalId: string) {
	const stored = {
		...payload,
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
	const mocked = createCommandContextMock(recordTransactionCommandBuilder, {
		payload,
		parameter,
		resources,
		sandbox,
	})
	mocked.context.message = getCommandMessageMock({
		principalId,
		tenantId: 'tenant-example',
		payload: { payload, parameter },
	})
	const command = safeBind(recordTransactionCommandBuilder.getCommandFunction(), service)
	return { command, context: mocked.context, save, service, stored }
}

describe('recordTransaction before guard', () => {
	test('allows Alex and supplies trusted scope to the repository', async () => {
		const fixture = await runAs('principal-alex')
		try {
			expect(await fixture.command(fixture.context, payload, parameter)).toEqual(fixture.stored)
			expect(fixture.save.calledOnceWith({
				...payload,
				accountId: 'account-operating',
				tenantId: 'tenant-example',
			})).toBe(true)
		} finally {
			await fixture.service.destroy()
		}
	})

	test('denies Sam before the repository effect', async () => {
		const fixture = await runAs('principal-sam')
		try {
			await expect(fixture.command(fixture.context, payload, parameter))
				.rejects.toThrow('Account action is not allowed')
			expect(fixture.save.called).toBe(false)
		} finally {
			await fixture.service.destroy()
		}
	})
})
